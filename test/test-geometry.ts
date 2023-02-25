'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint } from '../src/GeometryPoint';
import { GRect } from '../src/GeometryRectangle';
import { GLine } from '../src/GeometryLine';

const defaultGrabHandleDxy = 8;

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

      let bottomLeft = new GPoint(1, 3);
      let topRight = new GPoint(2, 4);

      var rect1: GRect = new GRect(1, 2, 1, 1);
      var rect2: GRect = new GRect(bottomLeft, topRight);
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

      expect(rect2.bottomLeft.equals(bottomLeft)).to.equal(true);
      expect(rect2.topRight.equals(topRight)).to.equal(true);

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

      rect3.bottomLeft = bottomLeft;
      rect3.topRight = topRight;
      expect(rect3.bottomLeft.equals(bottomLeft)).to.equal(true);
      expect(rect3.topRight.equals(topRight)).to.equal(true);
   });

   it("Needs to convert GRect to and from JSON()", function () {

      var rect1: GRect = new GRect(1, 2, 3, 4);

      var stream: string = rect1.streamToJSON();

      var rect2: GRect = new GRect();

      expect(rect1.equals(rect2)).to.equal(false);

      rect2.streamFromJSON(stream);

      expect(rect1.equals(rect2)).to.equal(true);
   });

   it("Needs to amend topLeft and bottomRight", function () {

      var selectionRect: GRect = new GRect(100, 100, 100, 100);

      var tr = new GPoint(200, 200);
      selectionRect.bottomLeft = tr;

      var bl = new GPoint(0, 0);
      selectionRect.bottomLeft = bl;

      expect(selectionRect.bottomLeft.equals(bl)).to.equal(true);
      expect(selectionRect.topRight.equals(tr)).to.equal(true);
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

   it("Needs to correctly do inclusion-testing for GPoint", function () {

      var selectionRect: GRect = new GRect(100, 100, 100, 100);

      var inside: GPoint = new GPoint(100, 100);
      var outside: GPoint = new GPoint(50, 50);
      var crossing: GPoint = new GPoint(50, 50);

      expect(selectionRect.includes(inside)).to.equal(true);
      expect(selectionRect.includes(outside)).to.equal(false);
      expect(selectionRect.includes(crossing)).to.equal(false);
   });

   it("Needs to correctly do normalisation for GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10); 
      var hiRight: GPoint = new GPoint(20, 20); 

      var normalised1 = GRect.normalisePoints(loLeft, hiRight);
      var normalised2 = GRect.normalisePoints(loLeft, hiRight);

      expect(normalised1.equals(normalised2)).to.equal(true);
   });

   it("Needs to correctly inflate GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(20, 20);

      var normalised = GRect.normalisePoints(loLeft, hiRight);
      var inflated = GRect.inflate(normalised, 1);

      expect(inflated.x === 9).to.equal(true);
      expect(inflated.y === 9).to.equal(true);
      expect(inflated.dx === 12).to.equal(true);
      expect(inflated.dy === 12).to.equal(true);
   });

   it("Needs to correctly clip a GPoint", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(20, 20);

      var rc = GRect.normalisePoints(loLeft, hiRight);

      expect((rc.clipPoint(new GPoint(0, 0)).x)).to.equal(loLeft.x);
      expect((rc.clipPoint(new GPoint(0, 0)).y)).to.equal(loLeft.y);
      expect((rc.clipPoint(new GPoint(21, 21)).x)).to.equal(hiRight.x);
      expect((rc.clipPoint(new GPoint(21, 21)).y)).to.equal(hiRight.y);
   });

   it("Needs to create grab handles on small GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(20, 20);

      var rc = new GRect (loLeft, hiRight);

      expect(GRect.createGrabHandlesAround (rc, 4, 4).length === 4).to.equal(true);
   });

   it("Needs to create grab handles on larger GRect", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(10 + GRect.minimumRelativeSizeForMidHandles() * defaultGrabHandleDxy,
                                       10 + GRect.minimumRelativeSizeForMidHandles() * defaultGrabHandleDxy);

      var rc = new GRect(loLeft, hiRight);

      expect(GRect.createGrabHandlesAround(rc, 4, 4).length === 8).to.equal(true);
   });

   it("Needs to test border intersections", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(10 + GRect.minimumRelativeSizeForMidHandles() * defaultGrabHandleDxy,
                                       10 + GRect.minimumRelativeSizeForMidHandles() * defaultGrabHandleDxy);

      var rc = new GRect(loLeft, hiRight);

      expect(rc.isOnTopBorder(hiRight, 1)).to.equal(true);
      expect(rc.isOnLeftBorder(loLeft, 1)).to.equal(true);
      expect(rc.isOnRightBorder(hiRight, 1)).to.equal(true);
      expect(rc.isOnBottomBorder(loLeft, 1)).to.equal(true);
      expect(rc.isOnBorder(hiRight, 1)).to.equal(true);
      expect(rc.isOnBorder(loLeft, 1)).to.equal(true);
      expect(rc.isOnBorder(hiRight, 1)).to.equal(true);
      expect(rc.isOnBorder(loLeft, 1)).to.equal(true);

      expect(rc.isOnTopBorder(loLeft, 1)).to.equal(false);
      expect(rc.isOnLeftBorder(hiRight, 1)).to.equal(false);
      expect(rc.isOnRightBorder(loLeft, 1)).to.equal(false);
      expect(rc.isOnBottomBorder(hiRight, 1)).to.equal(false);
      expect(rc.isOnBorder(new GPoint(0,0), 1)).to.equal(false);
   });

   it("Needs to test side grab handle intersections", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(10 + defaultGrabHandleDxy * GRect.minimumRelativeSizeForMidHandles(),
                                       10 + defaultGrabHandleDxy * GRect.minimumRelativeSizeForMidHandles());

      var rc = new GRect(loLeft, hiRight);

      expect(rc.isOnTopGrabHandle(rc.topMiddle, defaultGrabHandleDxy)).to.equal(true);
      expect(rc.isOnLeftGrabHandle(rc.leftMiddle, defaultGrabHandleDxy)).to.equal(true);
      expect(rc.isOnRightGrabHandle(rc.rightMiddle, defaultGrabHandleDxy)).to.equal(true);
      expect(rc.isOnBottomGrabHandle(rc.bottomMiddle, defaultGrabHandleDxy)).to.equal(true);

      expect(rc.isOnTopGrabHandle(loLeft, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnLeftGrabHandle(hiRight, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnRightGrabHandle(loLeft, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnBottomGrabHandle(hiRight, defaultGrabHandleDxy)).to.equal(false);
   });

   it("Needs to fail grab side handle intersections on small rectangle", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(20, 20);

      var rc = new GRect(loLeft, hiRight);

      expect(rc.isOnTopGrabHandle(rc.topMiddle, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnLeftGrabHandle(rc.leftMiddle, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnRightGrabHandle(rc.rightMiddle, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnBottomGrabHandle(rc.bottomMiddle, defaultGrabHandleDxy)).to.equal(false);
   });

   it("Needs to test corner grab handle intersections", function () {

      var loLeft: GPoint = new GPoint(10, 10);
      var hiRight: GPoint = new GPoint(10 + defaultGrabHandleDxy * GRect.minimumRelativeSizeForMidHandles(),
         10 + defaultGrabHandleDxy * GRect.minimumRelativeSizeForMidHandles());

      var rc = new GRect(loLeft, hiRight);

      expect(rc.isOnTopLeftGrabHandle(rc.topLeft, defaultGrabHandleDxy)).to.equal(true);
      expect(rc.isOnTopRightGrabHandle(rc.topRight, defaultGrabHandleDxy)).to.equal(true);
      expect(rc.isOnBottomRightGrabHandle(rc.bottomRight, defaultGrabHandleDxy)).to.equal(true);
      expect(rc.isOnBottomLeftGrabHandle(rc.bottomLeft, defaultGrabHandleDxy)).to.equal(true);

      expect(rc.isOnTopLeftGrabHandle(loLeft, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnTopRightGrabHandle(loLeft, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnBottomRightGrabHandle(loLeft, defaultGrabHandleDxy)).to.equal(false);
      expect(rc.isOnBottomLeftGrabHandle(hiRight, defaultGrabHandleDxy)).to.equal(false);
   });

   it("Needs to create, test & assign GLine", function () {

      let bottomLeft = new GPoint(1, 3);
      let topRight = new GPoint(2, 4);

      var line1: GLine = new GLine(1, 2, 5, 6);
      var line2: GLine = new GLine(bottomLeft, topRight);
      var line3: GLine = new GLine(line1);
      var line4: GLine = new GLine();

      expect(line1.equals(line1)).to.equal(true);
      expect(line1.equals(line2)).to.equal(false);
      expect(line1.equals(line3)).to.equal(true);
      expect(line1.equals(line4)).to.equal(false);
      expect(line1.start.x === 1).to.equal(true);
      expect(line1.start.y === 2).to.equal(true);
      expect(line1.end.x === 5).to.equal(true);
      expect(line1.end.y === 6).to.equal(true);
      expect(line1.boundingRectangle.x).to.equal(1);
      expect(line1.boundingRectangle.y).to.equal(2);
      expect(line1.boundingRectangle.dx).to.equal(4);
      expect(line1.boundingRectangle.dy).to.equal(4);

      line2.assign(line1);
      expect(line1.equals(line2)).to.equal(true);

      var caught: boolean = false;
      try {
         var line5: GLine = new GLine(null as GLine);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);;
   });

   it("Needs to convert GLine to and from JSON()", function () {

      var line1: GLine = new GLine(1, 2, 3, 4);

      var stream: string = line1.streamToJSON();

      var line2: GLine = new GLine();

      expect(line1.equals(line2)).to.equal(false);

      line2.streamFromJSON(stream);

      expect(line1.equals(line2)).to.equal(true);
   });
});


