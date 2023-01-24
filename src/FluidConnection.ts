// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, ConnectionState, SharedMap} from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

import { Persona } from './Persona';
import { ConnectionError, InvalidOperationError } from './Errors';

var alwaysWaitFor: number = 1000;

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

      try {
         this.localUser = localUser;

         const { container, services } = await this.client.createContainer(containerSchema);
         this.container = container;

         // Set default data as our user ID
         var storedVal: string = localUser.streamToJSON();

         (container.initialObjects.participantMap as any).set(localUser.id, storedVal);

         // Attach container to service and return assigned ID
         const id = await container.attach();
         await container.connect();
         await new Promise(resolve => setTimeout(resolve, alwaysWaitFor)); // Always wait - reduces chance of stale UI

         this.watchForChanges();

         return id;
      }
      catch (e: any) {
         throw new ConnectionError ("Error connecting new container to remote data service.")
      }
   }

   async attachToExisting (id: string, localUser: Persona): Promise<string> {

      try {
         this.localUser = localUser;

         const { container, services } = await this.client.getContainer(id, containerSchema);
         this.container = container;
         await container.connect();
         await new Promise(resolve => setTimeout(resolve, alwaysWaitFor)); // Always wait - reduces chance of stale UI

         // Add our User ID to the shared data if not there already 
         if (!this.containsMe()) {
            var storedVal: string = localUser.streamToJSON();
            (container.initialObjects.participantMap as any).set(localUser.id, storedVal);
         }

         this.watchForChanges();
         this.bubbleUp();

         return id;
      }
      catch (e: any) {
         throw new ConnectionError("Error attaching existing new container to remote data service.")
      }
   }

   canDisconnect(): boolean {

      if (!this.container)
         return false;

      var state = this.container.connectionState; 

      if (state !== ConnectionState.Connected)
         return false;

      // TODO - should we check this.container.isDirty;

      return true; 
   }

   async disconnect(): Promise<boolean> {

      if (this.canDisconnect()) {
         this.container.disconnect();

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
   }

   private bubbleUp(): void {
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

   private containsMe(): boolean {

      //  enumerate members of the sharedMap
      (this.container.initialObjects.participantMap as any).forEach((value: any, key: string, map: Map<string, any>) => {
         var temp: Persona = new Persona();

         temp.streamFromJSON(value);

         if (temp.id === this.localUser.id) {
            return true;
         }
      });
      return false;
   }
}