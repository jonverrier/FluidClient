// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, ConnectionState, SharedMap} from "fluid-framework";
// import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { AzureClient, AzureConnectionConfig, AzureLocalConnectionConfig, AzureRemoteConnectionConfig, AzureClientProps, ITokenProvider } from "@fluidframework/azure-client";

import { Interest, NotificationFor, Notifier } from './NotificationFramework';
import { Persona } from './Persona';
import { ConnectionError, InvalidOperationError } from './Errors';

var alwaysWaitAfterConnectFor: number = 1000;

export interface IConnectionProps {
}

/*
const serviceConfig = {
   connection: {
      tenantId: "tenant id", 
      tokenProvider: new InsecureTokenProvider("primary key", 
      { id: "userId", name: "Test User" }),
      endpoint: "https://eu.fluidrelay.azure.com", // REPLACE WITH YOUR SERVICE ENDPOINT
      type: "remote",
   }
};
*/

class LocalConnection implements AzureRemoteConnectionConfig {
   tokenProvider: ITokenProvider; 
   endpoint: string;
   type: any;
   tenantId: string;

   constructor() {
      var user: any = { id: "123", name: "Test User" };

      this.tenantId = "tenant ID";
      this.tokenProvider = new InsecureTokenProvider("primarykey", user);
      this.endpoint = "http://localhost:7070";
      this.type = "local";
   }
};

class LocalConfig implements AzureClientProps {
   connection: LocalConnection;

   constructor() {
      this.connection = new LocalConnection();
   }
};

var serviceConfig: LocalConfig = new LocalConfig();

const containerSchema = {
   initialObjects: { participantMap: SharedMap }
};

export class FluidConnection  extends Notifier {

   _props: IConnectionProps;
   _localUser: Persona;
   _client: AzureClient; // TinyliciousClient; 
   _container: IFluidContainer; 

   public static remoteUsersChangedNotificationId = "RemoteUsersChanged";
   public static remoteUsersChangedInterest = new Interest(FluidConnection.remoteUsersChangedNotificationId);

   constructor(props: IConnectionProps) {

      super();

      this._client = new AzureClient(serviceConfig); // TinyliciousClient();
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