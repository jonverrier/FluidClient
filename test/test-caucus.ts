// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Persona } from '../src/Persona';
import { Interest, NotificationFor } from '../src/NotificationFramework';
import { FluidConnection } from '../src/FluidConnection';

var myId: string = "1234";
var myName: string = "Jon";
var myThumbnail: string = "abcd";
var myLastSeenAt = new Date();

async function wait() {
   await new Promise(resolve => setTimeout(resolve, 500));
}

function onAdd(interest_: Interest, notification_: NotificationFor<string>) : void {

}

function onChange(interest_: Interest, notification_: NotificationFor<string>): void {

}

function onRemove(interest_: Interest, notification_: NotificationFor<string>): void {

}

describe("Caucus", function () {

   this.timeout(10000);

   var newConnection: FluidConnection;
   var persona: Persona;
   var id: string; 

   beforeEach(async () => {

      this.timeout(10000);
      newConnection = new FluidConnection({});

      persona = new Persona(myId, myName, myThumbnail, myLastSeenAt);
      id = await newConnection.createNew(persona);

      await wait();
   });

   afterEach(async () => {

      await wait();
      await newConnection.disconnect();
   });

   it("Can create a valid caucus", async function () {

      var workingPersona: Persona = new Persona(persona);

      let caucus = newConnection.participantCaucus();

      caucus.add(workingPersona.id, workingPersona);
      expect(caucus.has(workingPersona.id)).to.equal(true);
      expect(caucus.get(workingPersona.id).equals(workingPersona)).to.equal(true);
      expect(caucus.current().size).to.equal(1);

      workingPersona.name = "Joe";
      caucus.amend(workingPersona.id, workingPersona);
      expect(caucus.get(workingPersona.id).equals(workingPersona)).to.equal(true);

      expect(caucus.get("banana")).to.equal(null);

      caucus.remove(workingPersona.id);
      expect(caucus.has(workingPersona.id)).to.equal(false);
      expect(caucus.current().size).to.equal(0);
    });

   it("Can synchronise", async function () {

      var workingPersona: Persona = new Persona(persona);

      let caucus = newConnection.participantCaucus();

      var synchMap: Map<string, Persona> = new Map<string, Persona>();

      // Sync down to no elements
      caucus.synchFrom(synchMap);
      expect(caucus.current().size === 0).to.equal(true);

      // Sync in a new element
      synchMap.set(workingPersona.id, workingPersona);
      caucus.synchFrom(synchMap);
      expect(caucus.current().size === 1).to.equal(true);
      expect(caucus.get(workingPersona.id).equals(workingPersona)).to.equal(true);

      // Sync in a changed element
      workingPersona.name = "Joe 2";
      caucus.synchFrom(synchMap);
      expect(caucus.current().size === 1).to.equal(true);
      expect(caucus.get(workingPersona.id).equals(workingPersona)).to.equal(true);
   });
});

