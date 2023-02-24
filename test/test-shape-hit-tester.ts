'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { Pen, PenColour, PenStyle } from "../src/Pen";
import { Shape } from '../src/Shape';
import { HitTester } from '../src/ShapeHitTester';
import { IShapeInteractor} from '../src/CanvasInteractors';


describe("HitTestInteractor", function () {

   it("Needs to create HitTestInteractor and track to a click", function () {

      let shapeRect1 = new GRect(55, 55, 200, 200);
      let shapeRect2 = new GRect(100, 100, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Shape(shapeRect1, new Pen (PenColour.Black, PenStyle.Solid), true);
      var shape2: Shape = new Shape(shapeRect2, new Pen (PenColour.Black, PenStyle.Solid), false);
      shapes.set(shape1.id, shape1);
      shapes.set(shape2.id, shape2);

      var inside: GPoint = new GPoint(75, 75);
      var outside: GPoint = new GPoint(300, 300);
      var crossingLeft: GPoint = new GPoint(55, 75);
      var crossingRight: GPoint = new GPoint(255, 75);

      var controller: HitTester = new HitTester(shapes, IShapeInteractor.defaultGrabHandleDxDy());

      // Do real hit-testing
      expect(controller.hitTest(inside).hitTest).to.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(outside).hitTest).to.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(crossingLeft).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(crossingRight).hitTest).to.not.equal(HitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect1.topMiddle).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.bottomMiddle).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.leftMiddle).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.rightMiddle).hitTest).to.not.equal(HitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect1.topLeft).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.bottomLeft).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.topRight).hitTest).to.not.equal(HitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.bottomRight).hitTest).to.not.equal(HitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect2.topMiddle).hitTest).to.not.equal(HitTester.noHit().hitTest);

   });
});
