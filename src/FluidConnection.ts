// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, ConnectionState, SharedMap, IValueChanged } from "fluid-framework";
import { AzureClient } from "@fluidframework/azure-client";

import { log, tag } from 'missionlog';

import { Interest, NotificationFor, Notifier } from './NotificationFramework';
import { Persona } from './Persona';
import { ConnectionError, InvalidOperationError } from './Errors';
import { ClientProps } from './FluidConnectionProps';
import { CaucusOf, CaucusFactoryFunctionFor } from './Caucus';

var alwaysWaitAfterConnectFor: number = 1000;

export interface IConnectionProps {
}

const containerSchema = {
   initialObjects: { participantMap: SharedMap }
};

export class FluidConnection extends Notifier {

   _props: IConnectionProps;
   _localUser: Persona;
   _client: AzureClient;
   _container: IFluidContainer;

   public static remoteUsersChangedNotificationId = "RemoteUsersChanged";
   public static remoteUsersChangedInterest = new Interest(FluidConnection.remoteUsersChangedNotificationId);

   constructor(props: IConnectionProps) {

      super();

      this._client = null;
      this._props = props;
      this._container = null;
      this._localUser = null;
   }

   async createNew(localUser: Persona): Promise<string> {

      try {
         var clientProps: ClientProps = new ClientProps();

         await clientProps.connection.makeTokenProvider();

         this._client = new AzureClient(clientProps);

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

   async attachToExisting(id: string, localUser: Persona): Promise<string> {

      try {
         var clientProps: ClientProps = new ClientProps();

         await clientProps.connection.makeTokenProvider();

         this._client = new AzureClient(clientProps);

         this._localUser = localUser;

         const { container, services } = await this._client.getContainer(id, containerSchema);
         this._container = container;
         await container.connect();
         await new Promise(resolve => setTimeout(resolve, alwaysWaitAfterConnectFor)); // Always wait - reduces chance of stale UI

         // Add our User ID to the shared data - unconditional write so we have stable UUIDs
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
         throw new InvalidOperationError("The remote data service is not connected - please try again in a short while.")
      }
   }

   personCaucus(): CaucusOf<Persona> {
      return new CaucusOf<Persona>(this._container.initialObjects.participantMap as SharedMap, Persona.factoryFn);
   }

   watchForChanges(): void {
      (this._container.initialObjects.participantMap as any).on("valueChanged", (changed: IValueChanged, local: boolean, target: SharedMap) => {

         log.debug(tag.notification, "valueChanged:" + JSON.stringify(changed));

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