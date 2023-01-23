// Copyright (c) 2023 TXPCo Ltd
import { IFluidContainer, SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

import { Persona } from './Persona';

export interface IConnectionProps {
   onRemoteChange: (remoteUsers: Persona[]) => void;
}

class ConnectionState {

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

   watchForChanges(): void {
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