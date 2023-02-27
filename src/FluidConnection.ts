// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, ConnectionState, SharedMap, IValueChanged } from "fluid-framework";
import { AzureClient } from "@fluidframework/azure-client";

import { Interest, ObserverInterest, NotificationFor, Notifier, NotificationRouterFor } from './NotificationFramework';
import { Persona } from './Persona';
import { Shape } from './Shape';
import { ConnectionError, InvalidOperationError } from './Errors';
import { ClientProps } from './FluidConnectionProps';
import { CaucusOf } from './Caucus';

export interface IConnectionProps {
}

const containerSchema = {
   initialObjects: {
      participantMap: SharedMap,
      shapeMap: SharedMap
   }
};

export class FluidConnection extends Notifier {

   public static connectedNotificationId = "connected";
   public static connectedInterest = new Interest(FluidConnection.connectedNotificationId);

   _props: IConnectionProps;
   _localUser: Persona;
   _client: AzureClient;
   _container: IFluidContainer;
   _participantCaucus: CaucusOf<Persona>;
   _shapeCaucus: CaucusOf<Shape>;

   constructor(props: IConnectionProps) {

      super();

      this._client = null;
      this._props = props;
      this._container = null;
      this._localUser = null;
      this._participantCaucus = null;
      this._shapeCaucus = null;
   }

   async createNew(localUser: Persona): Promise<string> {

      try {
         var clientProps: ClientProps = new ClientProps();

         await clientProps.connection.makeTokenProvider();

         this._client = new AzureClient(clientProps);

         this._localUser = localUser;

         const { container, services } = await this._client.createContainer(containerSchema);
         this._container = container;

         let self = this;

         return new Promise<string>((resolve, reject) => {
            // Attach _container to service and return assigned ID
            const containerIdPromise = container.attach();

            containerIdPromise.then((containerId) => {
               self.setupAfterConnection(containerId);

               resolve (containerId);
            }).catch(() => {
               reject ();
            });
         });
      }
      catch (e: any) {
         throw new ConnectionError("Error connecting new container to remote data service: " + e.message);
      }
   }

   async attachToExisting(containerId: string, localUser: Persona): Promise<string> {

      try {
         var clientProps: ClientProps = new ClientProps();

         await clientProps.connection.makeTokenProvider();

         this._client = new AzureClient(clientProps);

         this._localUser = localUser;

         const { container, services } = await this._client.getContainer(containerId, containerSchema);
         this._container = container;

         this.setupAfterConnection(containerId);

         return containerId;
      }
      catch (e: any) {
         throw new ConnectionError("Error attaching existing container to remote data service: " + e.message)
      }
   }

   // local function to cut down duplication between createNew() and AttachToExisting())
   private setupAfterConnection(id: string): void {

      // Create caucuses so they exist when observers are notified of connection
      this._participantCaucus = new CaucusOf<Persona>(this._container.initialObjects.participantMap as SharedMap);
      this._shapeCaucus = new CaucusOf<Shape>(this._container.initialObjects.shapeMap as SharedMap);

      // Notify observers we are connected
      // They can then hook up their own observers to the caucus,
      // which will include the changes when we connect our own user ID to the caucus
      this.notifyObservers(FluidConnection.connectedInterest, new NotificationFor<string>(FluidConnection.connectedInterest, id));

      // Connect our own user ID to the caucus
      var storedVal: string = this._localUser.flatten();
      (this._container.initialObjects.participantMap as SharedMap).set(this._localUser.id, storedVal);

      // <<--- Begin Workaround ---> 
      //////////////////////////////
      // This is a workaround - until we understand why updates dont seem to flow from Fluid until
      // a remote party makes a change
      // Currently we write a nullShape here, and install a listener to remove it remotely. 
      (this._container.initialObjects.shapeMap as SharedMap).on("valueChanged", (changed: IValueChanged, local: boolean, target: SharedMap) => {
         if (!local) { // The change was made remotely
            if ((changed.key === Shape.nullShape().id) && (target.has(changed.key))) { // It is a nullShape, and not a deletion
               target.delete(changed.key);
            }
         }
      });

      // Now we write in the null shape
      var nullShape: Shape = Shape.nullShape();
      var stream: string = nullShape.flatten();
      (this._container.initialObjects.shapeMap as SharedMap).set(nullShape.id, stream);
      // <<--- End Workaround --->
      //////////////////////////////
   }


   canDisconnect(): boolean {

      if (!this._container)
         return false;

      var state = this._container.connectionState;
      if (state !== ConnectionState.Connected)
         return false;

      return true;
   }

   async disconnect(): Promise<boolean> {

      if (this.canDisconnect()) {
         await this._container.disconnect();

         return true;
      }
      else {
         throw new InvalidOperationError("The remote data service is not connected - please try again in a short while.")
      }
   }

   participantCaucus(): CaucusOf<Persona> {
      return this._participantCaucus;
   }

   shapeCaucus(): CaucusOf<Shape> {
      return this._shapeCaucus;
   }

}