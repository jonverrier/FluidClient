// Copyright (c) 2023 TXPCo Ltd
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";

import { Persona } from './Persona';

export interface IConnectionProps {

}

class ConnectionState {

}

const containerSchema = {
   initialObjects: { participantMap: SharedMap }
};

export class FluidConnection  {

   client: TinyliciousClient; 

   constructor(props: IConnectionProps) {

      this.client = new TinyliciousClient();
   }

   async createNew(localUser: Persona): Promise<string> {

      const { container, services } = await this.client.createContainer(containerSchema);

      // Set default data
      var storedVal: string = localUser.streamToJSON();
      (containerSchema.initialObjects.participantMap as any).set(localUser.id, storedVal);

      // Attach container to service and return assigned ID
      const id = container.attach();

      return id;
   }
}