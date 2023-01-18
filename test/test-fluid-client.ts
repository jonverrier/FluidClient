'use strict';
// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { FluidClient } from '../src/FluidClient';
import { Persona } from '../src/Persona';

var myId: string = "1234";
var myName: string = "Jon";
var myThumbnail: string = "abcd";
var myLastSeenAt = new Date();

var someoneElsesId: string = "5678";
var someoneElsesName: string = "Barry";
var someoneElsesThumbnail: string = "abcdefgh";
var someoneElsesLastSeenAt = new Date(0);

describe("FluidClient", function () {

   var persona1: Persona, persona2: Persona, personaErr: Persona;

   persona1 = new Persona(myId, myName, myThumbnail, myLastSeenAt);

   persona2 = new Persona(someoneElsesId, someoneElsesName, someoneElsesThumbnail, someoneElsesLastSeenAt);

   it("Needs to construct", function () {

      var fluidClient: FluidClient = new FluidClient();
      expect(fluidClient !== null).to.equal(true);
   });

   it("Needs to compare for equality and inequality", function () {

      var fluidClient1: FluidClient = new FluidClient();
      var fluidClient2: FluidClient = new FluidClient();

      // Test self comparison and comparison of newly constructed objects
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(true);

      // Test empty-non empty
      fluidClient1.localUser = persona1;
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(false);

      // Test empty-non empty
      fluidClient2.localUser = persona1;
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(true);

      // Test non-empty/non empty
      fluidClient1.addRemoteUser(persona2);
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      var fluidClient1: FluidClient = new FluidClient();
      fluidClient1.localUser = persona1;
      fluidClient1.addRemoteUser(persona2);

      // Local user is persona1
      expect(fluidClient1.localUser.equals(persona1)).to.equal(true);

      // Remote users contains persona2
      var found: Persona = fluidClient1.remoteUsers.find(function (element: Persona): boolean { return element.equals (persona2) } );
      expect(found.equals(persona2)).to.equal(true);
   });

   it("Needs to correctly store refreshed lastSeenAt attribute", function () {

      var fluidClient1: FluidClient = new FluidClient();
      fluidClient1.localUser = persona1;

      var date_ = new Date();
      fluidClient1.refreshLocalUser(date_);

      // Local user is persona1
      expect(fluidClient1.localUser.lastSeenAt.getTime()).to.equal(date_.getTime());
   });

   it("Needs to convert to and from JSON", function () {

      var fluidClient1: FluidClient = new FluidClient();
      fluidClient1.localUser = persona1;
      fluidClient1.addRemoteUser(persona2);

      var stream: string = fluidClient1.streamToJSON();

      var fluidClient2: FluidClient = new FluidClient();
      fluidClient2.streamFromJSON(stream);

      expect(fluidClient1.equals(fluidClient2)).to.equal(true);
   });
});

