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

   it("Needs to convert GPoint to and from JSON()", function () {

      var point1: GPoint = new GPoint(1, 2);

      var stream: string = point1.streamToJSON();

      var point2: GPoint = new GPoint(); 

      expect(point1.equals(point2)).to.equal(false);

      point2.streamFromJSON(stream);

      expect(point1.equals(point2)).to.equal(true);
   });

   it("Needs to create, test & assign GRect", function () {

      let topLeft = new GPoint(1, 3);
      let bottomRight = new GPoint(2, 4);

      var rect1: GRect = new GRect(1, 2, 1, 1);
      var rect2: GRect = new GRect(topLeft, bottomRight);
      var rect3: GRect = new GRect(rect1);
      var rect4: GRect = new GRect();

      expect(rect1.equals(rect1)).to.equal(true);
      expect(rect1.equals(rect2)).to.equal(false);
      expect(rect1.equals(rect3)).to.equal(true);
      expect(rect1.equals(rect4)).to.equal(false);
      expect(rect1.x === 1).to.equal(true);
      expect(rect1.y === 2).to.equal(true);
      expect(rect1.dx === 1).to.equal(true);
      expect(rect1.dy === 1).to.equal(true);

      expect(rect2.topLeft.equals(topLeft)).to.equal(true);
      expect(rect2.bottomRight.equals(bottomRight)).to.equal(true);

      rect2.assign(rect1);
      expect(rect1.equals(rect2)).to.equal(true);

      rect2.x = 5;
      rect2.y = 5;
      rect2.dx = 10;
      rect2.dy = 10;
      expect(rect2.x === 5).to.equal(true);
      expect(rect2.y === 5).to.equal(true);
      expect(rect2.dx === 10).to.equal(true);
      expect(rect2.dy === 10).to.equal(true);

      var caught: boolean = false;
      try {
         var rect5: GRect = new GRect(null as GRect);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

      rect3.topLeft = topLeft;
      rect3.bottomRight = bottomRight;
      expect(rect3.topLeft.equals(topLeft)).to.equal(true);
      expect(rect3.bottomRight.equals(bottomRight)).to.equal(true);
   });

   it("Needs to convert GRect to and from JSON()", function () {

      var rect1: GRect = new GRect(1, 2, 3, 4);

      var stream: string = rect1.streamToJSON();

      var rect2: GRect = new GRect();

      expect(rect1.equals(rect2)).to.equal(false);

      rect2.streamFromJSON(stream);

      expect(rect1.equals(rect2)).to.equal(true);
   });

   it("Needs to correctly do inclusion-testing for GRect", function () {

      var selectionRect: GRect = new GRect(100, 100, 100, 100);

      var insideRect: GRect = new GRect(100, 100, 50, 50);
      var outsideRect: GRect = new GRect(50, 50, 50, 50);
      var crossingRect: GRect = new GRect(50, 50, 100, 100);

      expect(selectionRect.fullyIncludes(insideRect)).to.equal(true);
      expect(selectionRect.fullyIncludes(outsideRect)).to.equal(false);
      expect(selectionRect.fullyIncludes(crossingRect)).to.equal(false);
   });

   it("Needs to correctly do normalisation for GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10); 
      var hiRight: GPoint = new GPoint(20, 20); 

      var normalised1 = GRect.normaliseFromPoints(loLeft, hiRight);
      var normalised2 = GRect.normaliseFromPoints(loLeft, hiRight);

      expect(normalised1.equals(normalised2)).to.equal(true);
   });

   it("Needs to create grab handles on small GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(20, 20);

      var rc = new GRect (loLeft, hiRight);

      expect(GRect.createGrabHandlesAround (rc, 4, 4).length === 4).to.equal(true);
   });

   it("Needs to create grab handles on larger GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(10 + GRect.minimumRelativeSizeForMidHandles * 4, 10 + GRect.minimumRelativeSizeForMidHandles * 4);

      var rc = new GRect(loLeft, hiRight);

      expect(GRect.createGrabHandlesAround(rc, 4, 4).length === 8).to.equal(true);
   });
});


