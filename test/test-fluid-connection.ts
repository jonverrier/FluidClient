// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Persona } from '../src/Persona';
import { FluidConnection } from '../src/FluidConnection';

var myId: string = "1234";
var myName: string = "Jon";
var myThumbnail: string = "abcd";
var myLastSeenAt = new Date();

async function wait() {
   await new Promise(resolve => setTimeout(resolve, 1500));
}

function onRemoteChange(remoteUsers: Persona[]) : void {

}

describe("FluidConnection", function () {

   it("Can attach to new container", async function () {

      this.timeout(5000);

      var newConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      var persona: Persona;

      persona = new Persona(myId, myName, myThumbnail, myLastSeenAt);

      const id = await newConnection.createNew(persona);
      await wait();

      var attachConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      await attachConnection.attachToExisting(id, persona);
      await wait();

      expect(attachConnection.canDisconnect() === true).to.equal(true);

      await newConnection.disconnect();
      await attachConnection.disconnect();
   });

   it("Cannot disconnect if never connected", function () {

      var newConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      expect(newConnection.canDisconnect() === false).to.equal(true);
   });

   it("Cannot disconnect if already disconnected", async function () {

      var newConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      var persona: Persona;

      persona = new Persona(myId, myName, myThumbnail, myLastSeenAt);

      const id = await newConnection.createNew(persona);
      await wait();

      await newConnection.disconnect();

      expect(newConnection.canDisconnect() === false).to.equal(true);
   });   

   it("Must throw an error if disconnected twice", async function () {

      var newConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      var persona: Persona;

      persona = new Persona(myId, myName, myThumbnail, myLastSeenAt);

      const id = await newConnection.createNew(persona);
      await wait();

      await newConnection.disconnect();

      var caught: boolean = true;

      try {
         await newConnection.disconnect();
      }
      catch (e: any) {
         caught = true;
      }

      expect(caught === true).to.equal(true);
   });
});

