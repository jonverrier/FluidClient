'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { IShapeInteractor, ShapeInteractor } from '../src/CanvasInteractors';

describe("ShapeInteractor", function () {

   it("Needs to create ShapeInteractor and track to a click", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new ShapeInteractor(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.click(pt1);

      expect(controller.rectangle().dx === ShapeInteractor.defaultDx()).to.equal(true);
      expect(controller.rectangle().dy === ShapeInteractor.defaultDy()).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });

   it("Needs to create ShapeInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new ShapeInteractor(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.mouseDown(pt1);
      controller.mouseMove(pt1);
      controller.mouseUp(pt1);

      expect(controller.rectangle().dx === ShapeInteractor.minimumDx()).to.equal(true);
      expect(controller.rectangle().dy === ShapeInteractor.minimumDy()).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - top left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(49, 49);

      var controller: IShapeInteractor = new ShapeInteractor(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.click(pt1);

      expect(controller.rectangle().topLeft.equals(bounds.topLeft)).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(251, 251);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new ShapeInteractor(bounds);

      expect(controller.isComplete()).to.equal(false);

      controller.mouseDown(pt1);
      controller.mouseMove(pt2);
      controller.mouseUp(pt2);

      expect(controller.rectangle().topLeft.equals(pt1)).to.equal(true);
      expect(controller.rectangle().bottomRight.equals(bounds.bottomRight)).to.equal(true);
      expect(controller.isComplete()).to.equal(true);
   });
});

