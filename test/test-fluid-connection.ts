// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Persona } from '../src/Persona';
import { FluidConnection } from '../src/FluidConnection';

var myId: string = "1234";
var myName: string = "Jon";
var myThumbnail: string = "abcd";
var myLastSeenAt = new Date();

function onRemoteChange(remoteUsers: Persona[]) : void {

}

describe("FluidConnection", function () {

   it("Cannot disconnect if never connected", function () {

      var newConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      expect(newConnection.canDisconnect() === false).to.equal(true);
   });

   it("Cannot disconnect if already disconnected", async function () {

      var newConnection: FluidConnection = new FluidConnection({ onRemoteChange: onRemoteChange });

      var persona1: Persona, persona2: Persona, personaErr: Persona;

      persona1 = new Persona(myId, myName, myThumbnail, myLastSeenAt);

      const id = await newConnection.createNew(persona1);
      await newConnection.disconnect();

      expect(newConnection.canDisconnect() === false).to.equal(true);
   });   
});

