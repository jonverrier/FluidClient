'use strict';
// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { uuid } from '../src/Uuid';


describe("Uuid", function () {

   it("Needs to create UUID", function () {

      var newUuid: string = uuid();
      expect(newUuid.length == 36).to.equal(true);
   });

   
});

