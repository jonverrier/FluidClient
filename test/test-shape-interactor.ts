'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { Shape, ShapeBorderColour, ShapeBorderStyle } from '../src/Shape';
import { IShapeInteractor, FreeRectangleInteractor, HitTestInteractor, HitTestResult } from '../src/CanvasInteractors';

describe("FreeRectangleInteractor", function () {

   it("Needs to create FreeRectangleInteractor and track to a click", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.click(pt1);

      expect(controller.rectangle.dx === FreeRectangleInteractor.defaultDx()).to.equal(true);
      expect(controller.rectangle.dy === FreeRectangleInteractor.defaultDy()).to.equal(true);
   });

   it("Needs to create FreeRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.mouseDown(pt1);
      controller.mouseMove(pt1);
      controller.mouseUp(pt1);

      expect(controller.rectangle.dx === FreeRectangleInteractor.minimumDx()).to.equal(true);
      expect(controller.rectangle.dy === FreeRectangleInteractor.minimumDy()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - top left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(49, 49);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.click(pt1);

      expect(controller.rectangle.topLeft.equals(bounds.topLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(251, 251);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.mouseDown(pt1);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle.topLeft.equals(pt1)).to.equal(true);
      expect(controller.rectangle.bottomRight.equals(bounds.bottomRight)).to.equal(true);
   });
});

describe("HitTestInteractor", function () {

   it("Needs to create HitTestInteractor and track to a click", function () {

      let bounds = new GRect(50, 50, 300, 300);
      let shapeRect = new GRect(55, 55, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Shape(shapeRect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      shapes.set(shape1.id, shape1);

      var inside: GPoint = new GPoint(100, 100);
      var outside: GPoint = new GPoint(49, 49);
      var crossing: GPoint = new GPoint(50, 50);

      var controller: HitTestInteractor = new HitTestInteractor(shapes, bounds);

      // These just exercise the functions - no logic
      controller.mouseDown(inside);
      controller.mouseMove(inside);
      controller.mouseUp(inside);
      controller.click(inside);

      expect(controller.rectangle.equals(bounds)).to.equal(true);
      expect(controller.shapes === shapes).to.equal(true);
      expect(controller.lastHitTest === HitTestResult.None).to.equal(true);

      // Do real hit-testing
      controller.mouseMove(crossing);
   });
});