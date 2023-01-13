'use strict';
// Copyright TXPCo ltd, 2021
import { FluidClient } from '../src/FluidClient';

import { expect } from 'chai';
import { describe, it} from 'mocha';

var myName: string = "Jon";
var someoneElsesName: string = "Barry";

describe("FluidClient", function () {


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
      fluidClient1.registerUser(myName);
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(false);

      // Test empty-non empty
      fluidClient2.registerUser(myName);
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(true);

      // Test non-empty/non empty
      fluidClient1.registerUser(someoneElsesName);
      expect(fluidClient1.equals(fluidClient1)).to.equal(true);
      expect(fluidClient1.equals(fluidClient2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      var fluidClient1: FluidClient = new FluidClient();
      fluidClient1.registerUser(myName);

      // Test self comparison and comparison of newly constructed objects
      var found: String = fluidClient1.registeredUsers().find(function (element: string ): boolean { return element == myName } );

      expect(found).to.equal(myName);
   });

/*
   it("Needs to correctly change attributes", function () {

      expect(false).to.equal(true);
   });
   */
   

   it("Needs to convert to and from JSON", function () {

      var fluidClient1: FluidClient = new FluidClient();
      fluidClient1.registerUser(myName);

      var stream: string = fluidClient1.streamToJSON();

      var fluidClient2: FluidClient = new FluidClient();
      fluidClient2.streamFromJSON(stream);

      expect(fluidClient1.equals(fluidClient2)).to.equal(true);
   });
});

