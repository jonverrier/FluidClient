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
   await new Promise(resolve => setTimeout(resolve, 1000));
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

   it("Can create a valid caucus", async function () {

      this.timeout(10000);

      newConnection = new FluidConnection({});

      persona = new Persona(myId, myName, myThumbnail, myLastSeenAt);
      id = await newConnection.createNew(persona);

      await wait();
      let caucus = newConnection.participantCaucus();

      caucus.add(persona.id, persona);
      expect(caucus.has(persona.id)).to.equal(true);
      expect(caucus.get(persona.id).equals(persona)).to.equal(true);
      expect(caucus.current().size).to.equal(1);

      persona.name = "Joe";
      caucus.amend(persona.id, persona);
      expect(caucus.get(persona.id).equals(persona)).to.equal(true);

      expect(caucus.get("banana")).to.equal(null);

      caucus.remove(persona.id);
      expect(caucus.has(persona.id)).to.equal(false);
      expect(caucus.current().size).to.equal(0);

      await wait();
      await newConnection.disconnect();
   });

});

