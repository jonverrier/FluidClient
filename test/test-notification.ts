'use strict';
// Copyright TXPCo ltd, 2021
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Interest, Notifier } from '../src/NotificationFramework';


describe("NotificationFramework", function () {

   it("Need to create, test & assign Interest", function () {

      var notifier = new Notifier();
      var notificationId1 : string = "Playing";
      var notificationId2: string = "Paused";

      var interest1: Interest = new Interest(notifier, notificationId1);
      var interest2: Interest = new Interest(notifier, notificationId2);
      var interest3: Interest = new Interest (interest1);

      expect(interest1.equals(interest1)).to.equal(true);
      expect(interest1.equals(interest2)).to.equal(false);
      expect(interest1.equals(interest3)).to.equal(true);
      expect(interest1.notificationId === notificationId1).to.equal(true);
      expect(interest1.notifier === notifier).to.equal(true);
   });

   
});

