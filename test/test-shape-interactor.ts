'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { Shape, ShapeBorderColour, ShapeBorderStyle } from '../src/Shape';
import {
   IShapeInteractor,
   FreeRectangleInteractor,
   LeftRectangleInteractor,
   RightRectangleInteractor,
   TopRectangleInteractor,
   BottomRectangleInteractor,
   RectangleMoveInteractor,
   HitTestInteractor,
   HitTestResult
} from '../src/CanvasInteractors';

describe("IShapeInteractor", function () {

   it("Needs to provide defaultDXY values", function () {

      expect(IShapeInteractor.defaultDx() > 0).to.equal(true);
      expect(IShapeInteractor.defaultDy() > 0).to.equal(true);
   });
});

describe("FreeRectangleInteractor", function () {

   it("Needs to create FreeRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.mouseDown(pt);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.dx === FreeRectangleInteractor.minimumDx()).to.equal(true);
      expect(controller.rectangle.dy === FreeRectangleInteractor.minimumDy()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(49, 49);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.mouseDown(pt);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(251, 251);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.mouseDown(pt1);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

describe("HitTestInteractor", function () {

   it("Needs to create HitTestInteractor and track to a click", function () {

      let bounds = new GRect(50, 50, 300, 300);
      let shapeRect = new GRect(55, 55, 100, 100);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Shape(shapeRect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      shapes.set(shape1.id, shape1);

      var inside: GPoint = new GPoint(56, 56);
      var outside: GPoint = new GPoint(49, 49);
      var crossingLeft: GPoint = new GPoint(55, 75);
      var crossingRight: GPoint = new GPoint(155, 75);

      var controller: HitTestInteractor = new HitTestInteractor(shapes, bounds, IShapeInteractor.defaultGrabHandleDxDy());

      controller.shapes = shapes;

      // Not doing anything, just call the functions for coverage
      expect(controller.mouseMove(inside)).to.equal(false);
      expect(controller.mouseUp(inside)).to.equal(false);
      expect(controller.mouseDown(inside)).to.equal(false);

      expect(controller.rectangle.equals(bounds)).to.equal(true);
      expect(controller.shapes === shapes).to.equal(true);
      expect(controller.lastHitTest === HitTestResult.None).to.equal(true);
      expect(controller.lastHitShape === null).to.equal(true);

      // Do real hit-testing
      expect(controller.mouseMove(inside)).to.equal(false);
      expect(controller.mouseMove(outside)).to.equal(false);
      expect(controller.mouseMove(crossingLeft)).to.equal(true);
      expect(controller.mouseMove(crossingRight)).to.equal(true);

      expect(controller.mouseMove(shapeRect.topMiddle)).to.equal(true);
      expect(controller.mouseMove(shapeRect.bottomMiddle)).to.equal(true);
      expect(controller.mouseMove(shapeRect.leftMiddle)).to.equal(true);
      expect(controller.mouseMove(shapeRect.rightMiddle)).to.equal(true);

   });
});

describe("RightRectangleInteractor", function () {

   it("Needs to create RightRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new RightRectangleInteractor(bounds, initial);
 
      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.dx === 50).to.equal(true);
      expect(controller.rectangle.dy === initial.dy).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new RightRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.x === bounds.x).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new RightRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.bottomLeft.equals(initial.bottomLeft)).to.equal(true);
      expect(controller.rectangle.right === bounds.right).to.equal(true);
   });
});

describe("LeftRectangleInteractor", function () {

   it("Needs to create LeftRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.dx === 150).to.equal(true);
      expect(controller.rectangle.dy === initial.dy).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.x === bounds.x).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.right === bounds.right).to.equal(true);
   });
});

describe("TopRectangleInteractor", function () {

   it("Needs to create TopRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.topRight);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.dx === initial.dx).to.equal(true);
      expect(controller.rectangle.top === pt.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.topRight);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.y === bounds.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.topRight);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.top === bounds.top).to.equal(true);
   });
});

describe("BottomRectangleInteractor", function () {

   it("Needs to create BottomRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomRight);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.y === pt.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomRight);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.y === bounds.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomRight);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.top === bounds.top).to.equal(true);
   });
});

describe("RectangleMoveInteractor", function () {

   it("Needs to create RectangleMoveInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);

      var controller: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.topLeft);

      controller.mouseDown(initial.topLeft);
      controller.mouseMove(initial.topLeft);
      controller.mouseUp(initial.topRight);

      expect(controller.rectangle.dy === initial.dy).to.equal(true);
      expect(controller.rectangle.dx === initial.dx).to.equal(true);
      expect(controller.rectangle.x === initial.topRight.x).to.equal(true);
      expect(controller.rectangle.y === initial.bottomRight.y).to.equal(true);
   });


   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.bottomLeft);

      controller.mouseDown(initial.bottomLeft);
      controller.mouseMove(pt);
      controller.mouseUp(pt);

      expect(controller.rectangle.dy === initial.dy).to.equal(true);
      expect(controller.rectangle.dx === initial.dx).to.equal(true);
      expect(controller.rectangle.x === bounds.bottomLeft.x).to.equal(true);
      expect(controller.rectangle.y === bounds.bottomLeft.y).to.equal(true);
   });
   /*
   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.mouseDown(initial.bottomRight);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.top === bounds.top).to.equal(true);
   });
   */
});