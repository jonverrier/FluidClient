// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, ConnectionState, SharedMap} from "fluid-framework";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { AzureClient, AzureLocalConnectionConfig, AzureRemoteConnectionConfig, AzureClientProps, ITokenProvider } from "@fluidframework/azure-client";
import axios from "axios";

import { Interest, NotificationFor, Notifier } from './NotificationFramework';
import { Persona } from './Persona';
import { ConnectionError, InvalidOperationError } from './Errors';

var documentUuid: string = "b03724b3-4be0-4491-b0fa-43b01ab80d50";
var alwaysWaitAfterConnectFor: number = 1000;

export interface IConnectionProps {
}

class ConnectionConfig implements AzureRemoteConnectionConfig {

   tokenProvider: ITokenProvider; 
   endpoint: string;
   type: any;
   tenantId: string;
   documentId: string;


   private async getToken(tenantId_: string, documentId_: string | undefined, name_: string, id_: string): Promise<string> {

      const response = await axios.get('/api/key', {
         params: {
            tenantId_,
            documentId_,
            userId: id_,
            userName: name_
         },
      });

      if (!response.data)
         throw new ConnectionError("Error connecting to remote data services for API token.");

      return response.data as string;
   }

   constructor() {
      this.documentId = documentUuid;
      var user: any = { id: documentUuid, name: "Whiteboard Application" };

      if (false) {
         this.tenantId = "06fcf322-99f7-412d-9889-f2e94b066b7e";
         this.endpoint = "http://localhost:7070";
         this.type = "local";
         this.tokenProvider = new InsecureTokenProvider('testKey', user);
      }
      else {
         this.tenantId = "06fcf322-99f7-412d-9889-f2e94b066b7e";
         this.endpoint = "https://eu.fluidrelay.azure.com";
         this.type = "remote";

         this.getToken(this.tenantId, this.documentId, user.name, user.id)
            .then((key) => {
               this.tokenProvider = new InsecureTokenProvider(key, user);
            })
            .catch(() => {
               this.tokenProvider = null;
            });
      }
   }
};

class ClientProps implements AzureClientProps {
   connection: ConnectionConfig;

   constructor() {
      this.connection = new ConnectionConfig();
   }
};

var clientProps: ClientProps = new ClientProps();

const containerSchema = {
   initialObjects: { participantMap: SharedMap }
};

export class FluidConnection  extends Notifier {

   _props: IConnectionProps;
   _localUser: Persona;
   _client: AzureClient; 
   _container: IFluidContainer; 

   public static remoteUsersChangedNotificationId = "RemoteUsersChanged";
   public static remoteUsersChangedInterest = new Interest(FluidConnection.remoteUsersChangedNotificationId);

   constructor(props: IConnectionProps) {

      super();

      // TODO - wait for the asnc get to complete
      this._client = new AzureClient(clientProps); 
      this._props = props;
   }

   async createNew(localUser: Persona): Promise<string> {

      try {
         this._localUser = localUser;

         const { container, services } = await this._client.createContainer(containerSchema);
         this._container = container;

         // Set default data as our user ID
         var storedVal: string = localUser.streamToJSON();

         (container.initialObjects.participantMap as any).set(localUser.id, storedVal);

         // Attach _container to service and return assigned ID
         const id = await container.attach();
         await container.connect();
         await new Promise(resolve => setTimeout(resolve, alwaysWaitAfterConnectFor)); // Always wait - reduces chance of stale UI

         this.watchForChanges();

         return id;
      }
      catch (e: any) {
         throw new ConnectionError("Error connecting new container to remote data service:" + e.message);
      }
   }

   async attachToExisting (id: string, localUser: Persona): Promise<string> {

      try {
         this._localUser = localUser;

         const { container, services } = await this._client.getContainer(id, containerSchema);
         this._container = container;
         await container.connect();
         await new Promise(resolve => setTimeout(resolve, alwaysWaitAfterConnectFor)); // Always wait - reduces chance of stale UI

         // Add our User ID to the shared data - unconditional write as we have stable UUIDs
         var storedVal: string = localUser.streamToJSON();
         (container.initialObjects.participantMap as any).set(localUser.id, storedVal);

         this.watchForChanges();
         this.bubbleUp();

         return id;
      }
      catch (e: any) {
         throw new ConnectionError("Error attaching existing new container to remote data service:" + e.message)
      }
   }

   canDisconnect(): boolean {

      if (!this._container)
         return false;

      var state = this._container.connectionState; 

      if (state !== ConnectionState.Connected)
         return false;

      // TODO - should we check this._container.isDirty;

      return true; 
   }

   async disconnect(): Promise<boolean> {

      if (this.canDisconnect()) {
         this._container.disconnect();

         return true;
      }
      else {
         throw new InvalidOperationError ("The remote data service is not connected - please try again in a short while.")
      }
   }

   watchForChanges(): void {
      (this._container.initialObjects.participantMap as any).on("valueChanged", () => {

         this.bubbleUp();
      });
   }

   private bubbleUp(): void {
      var _remoteUsers = new Array<Persona>();

      //  enumerate members of the sharedMap
      (this._container.initialObjects.participantMap as any).forEach((value: any, key: string, map: Map<string, any>) => {
         var temp: Persona = new Persona();

         temp.streamFromJSON(value);

         if (temp.id !== this._localUser.id) {
            _remoteUsers.push(temp);
         }
      });

      var notificationData: NotificationFor<Array<Persona>> = new NotificationFor<Array<Persona>>(FluidConnection.remoteUsersChangedInterest, _remoteUsers);

      this.notifyObservers(FluidConnection.remoteUsersChangedInterest, notificationData);
   }
}