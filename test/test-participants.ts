'use strict';
// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Persona } from '../src/Persona';
import { Participants } from '../src/Participants';

var myId: string = "1234";
var myName: string = "Jon";
var myThumbnail: string = "abcd";
var myLastSeenAt = new Date();

var someoneElsesId: string = "5678";
var someoneElsesName: string = "Barry";
var someoneElsesThumbnail: string = "abcdefgh";
var someoneElsesLastSeenAt = new Date(0);

describe("Participants", function () {

   var persona1: Persona, persona2: Persona, personaErr: Persona;

   persona1 = new Persona(myId, myName, myThumbnail, myLastSeenAt);

   persona2 = new Persona(someoneElsesId, someoneElsesName, someoneElsesThumbnail, someoneElsesLastSeenAt);

   it("Needs to construct", function () {

      var participants: Participants = new Participants();
      expect(participants !== null).to.equal(true);
   });

   it("Needs to construct a populated object", function () {

      var participants: Participants = new Participants(persona1, new Array<Persona>(persona2));

      expect(participants.localUser === persona1).to.equal(true);
      expect(participants.remoteUsers[0] === persona2).to.equal(true);
   });

   it("Needs to compare for equality and inequality", function () {

      var participants1: Participants = new Participants();
      var participants2: Participants = new Participants();

      // Test self comparison and comparison of newly constructed objects
      expect(participants1.equals(participants1)).to.equal(true);
      expect(participants1.equals(participants2)).to.equal(true);

      // Test empty-non empty
      participants1.localUser = persona1;
      expect(participants1.equals(participants1)).to.equal(true);
      expect(participants1.equals(participants2)).to.equal(false);

      // Test empty-non empty
      participants2.localUser = persona1;
      expect(participants1.equals(participants1)).to.equal(true);
      expect(participants1.equals(participants2)).to.equal(true);

      // Test non-empty/non empty
      participants1.remoteUsers = new Array<Persona> (persona2);
      expect(participants1.equals(participants1)).to.equal(true);
      expect(participants1.equals(participants2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      var participants1: Participants = new Participants();
      participants1.localUser = persona1;
      participants1.remoteUsers = new Array<Persona>(persona2);

      // Local user is persona1
      expect(participants1.localUser.equals(persona1)).to.equal(true);

      // Remote users contains persona2
      var found: Persona = participants1.remoteUsers.find(function (element: Persona): boolean { return element.equals (persona2) } );
      expect(found.equals(persona2)).to.equal(true);
   });

   it("Needs to correctly store refreshed lastSeenAt attribute", function () {

      var participants1: Participants = new Participants();
      participants1.localUser = persona1;

      var date_ = new Date();
      participants1.refreshLocalUser(date_);

      // Local user is persona1
      expect(participants1.localUser.lastSeenAt.getTime()).to.equal(date_.getTime());
   });

   it("Needs to convert to and from JSON", function () {

      var participants1: Participants = new Participants();
      participants1.localUser = persona1;
      participants1.remoteUsers = new Array<Persona>(persona2);

      var stream: string = participants1.streamToJSON();

      var participants2: Participants = new Participants();
      participants2.streamFromJSON(stream);

      expect(participants1.equals(participants2)).to.equal(true);
   });
});

