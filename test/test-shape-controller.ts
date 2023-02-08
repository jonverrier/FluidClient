'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { IShapeController, ShapeController } from '../src/CanvasControllers';

describe("ShapeController", function () {

   it("Needs to create ShapeController and track to a click", function () {

      var bounds: GRect = new GRect(50, 50, 100, 100);
      var pt1: GPoint = new GPoint(51, 51);

      var controller: IShapeController = new ShapeController(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.click(pt1);

      expect(controller.rectangle().topLeft.equals(pt1)).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });

   it("Needs to create ShapeController with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 100, 100);
      var pt1: GPoint = new GPoint(51, 51);

      var controller: IShapeController = new ShapeController(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.mouseDown(pt1);
      controller.mouseMove(pt1);
      controller.mouseUp(pt1);

      expect(controller.rectangle().topLeft.equals(pt1)).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - top left", function () {

      var bounds: GRect = new GRect(50, 50, 100, 100);
      var pt1: GPoint = new GPoint(49, 49);

      var controller: IShapeController = new ShapeController(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.click(pt1);

      expect(controller.rectangle().topLeft.equals(bounds.topLeft)).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower right", function () {

      var bounds: GRect = new GRect(50, 50, 100, 100);
      var pt1: GPoint = new GPoint(51, 51);
      var pt2: GPoint = new GPoint(151, 151);

      var controller: IShapeController = new ShapeController(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.mouseDown(pt1);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle().topLeft.equals(pt1)).to.equal(true);
      expect(controller.rectangle().bottomRight.equals(bounds.bottomRight)).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });
});

