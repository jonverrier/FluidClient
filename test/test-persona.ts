'use strict';
// Copyright TXPCo ltd, 2021
import { Persona} from '../src/Persona';

import { expect } from 'chai';
import { describe, it } from 'mocha';


var myId: string = "1234";
var myName: string = "Jon";
var myThumbnail: string = "abcd";
var myLastSeenAt = new Date();

var someoneElsesId: string = "5678";
var someoneElsesName: string = "Barry";
var someoneElsesThumbnail: string = "abcdefgh";
var someoneElsesLastSeenAt = new Date(0);

describe("Persona", function () {

   var persona1: Persona, persona2: Persona, personaErr:Persona;

   persona1 = new Persona(myId, myName, myThumbnail, myLastSeenAt);

   persona2 = new Persona(someoneElsesId, someoneElsesName, someoneElsesThumbnail, someoneElsesLastSeenAt);

   it("Needs to construct an empty object", function () {

      var personaEmpty = new Persona();

      expect(personaEmpty.id).to.equal(null);
   });

   it("Needs to detect invalid id", function () {

      var caught: boolean = false;
      try {
         var personaErr: Persona = new Persona(1 as unknown as string, myId, myThumbnail, myLastSeenAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect invalid name", function () {

      var caught: boolean = false;
      try {
         var personaErr: Persona = new Persona(myId, null, myThumbnail, myLastSeenAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect invalid thumbnail", function () {

      var caught: boolean = false;
      try {
         var personaErr: Persona = new Persona(myId, myName, null, myLastSeenAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to compare for equality and inequality", function () {

      var personaNew: Persona = new Persona(persona1.id, persona1.name, persona1.thumbnailB64, persona1.lastSeenAt);

      expect(persona1.equals(persona1)).to.equal(true);
      expect(persona1.equals(personaNew)).to.equal(true);
      expect(persona1.equals(persona2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(persona1.name === myName).to.equal(true);
      expect(persona1.thumbnailB64 === myThumbnail).to.equal(true);
      expect(persona1.lastSeenAt === myLastSeenAt).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      var personaNew: Persona = new Persona(persona1.id, persona1.name, persona1.thumbnailB64, persona1.lastSeenAt);

      personaNew.id = someoneElsesId;
      personaNew.name = someoneElsesName;
      personaNew.thumbnailB64 = someoneElsesThumbnail;
      personaNew.lastSeenAt = someoneElsesLastSeenAt;

      expect(persona2.equals (personaNew)).to.equal(true);
   });

   it("Needs to catch errors on change id attributes", function () {

      var caught: boolean = false;
      try {
         persona1.id = 1 as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

   });

   it("Needs to throw errors on change name attribute", function () {

      var caught: boolean = false;
      try {
         persona1.name = "";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

   });

   it("Needs to throw errors on change thumbnail attribute using null", function () {

      var caught: boolean = false;
      try {
         persona1.thumbnailB64 = "";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

   });

   it("Needs to throw errors on change thumbnail attribute using invalid B64 string", function () {

      var caught: boolean = false;
      try {
         persona1.thumbnailB64 = "abcde";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to fall back to browser shim thumbnail attribute ", function () {

      var caught: boolean = false;
      try {
         persona1.setThumbnailB64 ("abcdefgh", true);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(false);

   });

   it("Needs to throw errors when falling back to browser shim thumbnail attribute ", function () {

      var caught: boolean = false;
      try {
         persona1.setThumbnailB64(1 as unknown as string, true);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

   });

   it("Needs to test notLoggedIn status", function () {

      let notLoggedIn: Persona = Persona.notLoggedIn();
      let notLoggedIn2: Persona = new Persona(notLoggedIn.id, notLoggedIn.name, notLoggedIn.thumbnailB64, notLoggedIn.lastSeenAt); 

      expect(Persona.isNotLoggedIn(notLoggedIn)).to.equal(true);
      expect(Persona.isNotLoggedIn(notLoggedIn2)).to.equal(true);
   });

   it("Needs to test unknown status", function () {

      let unknown: Persona = Persona.unknown();
      let unknown2: Persona = new Persona(unknown.id, unknown.name, unknown.thumbnailB64, unknown.lastSeenAt);

      expect(Persona.isUnknown(unknown)).to.equal(true);
      expect(Persona.isUnknown(unknown2)).to.equal(true);
   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = persona1.streamToJSON();

      var personaNew: Persona = new Persona(persona1.id, persona1.name, persona1.thumbnailB64, persona1.lastSeenAt);
      personaNew.streamFromJSON(stream);

      expect(persona1.equals(personaNew)).to.equal(true);
   });

});
