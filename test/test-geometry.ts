'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';


describe("Geometry", function () {

   it("Needs to create, test & assign GPoint", function () {

      var point1: GPoint = new GPoint(1, 2);
      var point2: GPoint = new GPoint(1, 3);
      var point3: GPoint = new GPoint(point1);
      var point4: GPoint = new GPoint();

      expect(point1.equals(point1)).to.equal(true);
      expect(point1.equals(point2)).to.equal(false);
      expect(point1.equals(point3)).to.equal(true);
      expect(point1.equals(point4)).to.equal(false);
      expect(point1.x === 1).to.equal(true);
      expect(point1.y === 2).to.equal(true);

      point2.assign(point1);
      expect(point1.equals(point2)).to.equal(true);

      point2.x = 5;
      point2.y = 5;
      expect(point2.x === 5).to.equal(true);
      expect(point2.y === 5).to.equal(true);

      var caught: boolean = false;
      try {
         var point5: GPoint = new GPoint(null as GPoint);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to create, test & assign GRect", function () {

      var rect1: GRect = new GRect(1, 2, 1, 1);
      var rect2: GRect = new GRect(new GPoint (1, 3), new GPoint (2, 4));
      var rect3: GRect = new GRect(rect1);
      var rect4: GRect = new GRect();

      expect(rect1.equals(rect1)).to.equal(true);
      expect(rect1.equals(rect2)).to.equal(false);
      expect(rect1.equals(rect3)).to.equal(true);
      expect(rect1.equals(rect4)).to.equal(false);
      expect(rect1.xmin === 1).to.equal(true);
      expect(rect1.ymin === 2).to.equal(true);
      expect(rect1.xmax === 2).to.equal(true);
      expect(rect1.ymax === 3).to.equal(true);

      rect2.assign(rect1);
      expect(rect1.equals(rect2)).to.equal(true);

      rect2.xmin = 5;
      rect2.ymin = 5;
      rect2.xmax = 10;
      rect2.ymax = 10;
      expect(rect2.xmin === 5).to.equal(true);
      expect(rect2.ymin === 5).to.equal(true);
      expect(rect2.xmax === 10).to.equal(true);
      expect(rect2.ymax === 10).to.equal(true);

      var caught: boolean = false;
      try {
         var rect5: GRect = new GRect(null as GRect);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

});


