// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, ConnectionState, SharedMap} from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

import { Persona } from './Persona';
import { InvalidOperationError } from './Errors';

export interface IConnectionProps {
   onRemoteChange: (remoteUsers: Persona[]) => void;
}

const containerSchema = {
   initialObjects: { participantMap: SharedMap }
};

export class FluidConnection  {

   props: IConnectionProps;
   localUser: Persona;
   remoteUsers: Persona[];
   client: TinyliciousClient; 
   container: IFluidContainer; 

   constructor(props: IConnectionProps) {

      this.client = new TinyliciousClient();
      this.props = props;
   }

   async createNew(localUser: Persona): Promise<string> {

      this.localUser = localUser;

      const { container, services } = await this.client.createContainer(containerSchema);
      this.container = container;

      // Set default data as our user ID
      var storedVal: string = localUser.streamToJSON();

      (container.initialObjects.participantMap as any).set(localUser.id, storedVal);

      // Attach container to service and return assigned ID
      const id = container.attach();
      this.watchForChanges();

      return id;
   }

   async attachToExisting (id: string, localUser: Persona): Promise<string> {

      this.localUser = localUser;

      const { container, services } = await this.client.getContainer(id, containerSchema);
      this.container = container;

      // Add our User ID to the shared data 
      var storedVal: string = localUser.streamToJSON();

      (container.initialObjects.participantMap as any).set(localUser.id, storedVal);
      this.watchForChanges();
      this.bubbleUp();

      return id;
   }

   canDisconnect(): boolean {

      if (!this.container)
         return false;

      if (this.container.connectionState !== ConnectionState.Connected)
         return false;

      return !this.container.isDirty;
   }

   async disconnect(): Promise<boolean> {

      if (this.container.connectionState === ConnectionState.Connected) {
         //  enumerate members of the sharedMap, remove ourselves from it
         (this.container.initialObjects.participantMap as any).forEach((value: any, key: string, map: Map<string, any>) => {
            var temp: Persona = new Persona();

            temp.streamFromJSON(value);

            if (temp.id === this.localUser.id) {
               (this.container.initialObjects.participantMap as any).delete(key);
            }
         });

         return true;
      }
      else {
         throw new InvalidOperationError ("The remote data service is not connected - please try again in a short while.")
      }
   }

   watchForChanges(): void {
      (this.container.initialObjects.participantMap as any).on("valueChanged", () => {

         this.bubbleUp();
      });

      (this.container.initialObjects.participantMap as any).on("valueChanged", () => {

         this.bubbleUp();
      });
   }

   bubbleUp(): void {
      this.remoteUsers = new Array<Persona>();

      //  enumerate members of the sharedMap
      (this.container.initialObjects.participantMap as any).forEach((value: any, key: string, map: Map<string, any>) => {
         var temp: Persona = new Persona();

         temp.streamFromJSON(value);

         if (temp.id !== this.localUser.id) {
            this.remoteUsers.push(temp);
         }
      });

      this.props.onRemoteChange(this.remoteUsers);
   }
}