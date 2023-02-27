'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint } from '../src/GeometryPoint';
import { GLine } from '../src/GeometryLine';
import { GRect } from '../src/GeometryRectangle';

import { Pen, PenColour, PenStyle } from "../src/Pen";
import { Shape } from '../src/Shape';
import { Rectangle } from '../src/Rectangle';
import { Line } from '../src/Line';
import { ShapeGroupHitTester, ShapeHitTester, ShapeHitTesterFactory } from '../src/ShapeHitTester';
import { IShapeInteractor} from '../src/CanvasInteractors';



describe("ShapeGroupHitTester", function () {

   it("Needs to create ShapeGroupHitTester and track to a click on a Rectangle", function () {

      let shapeRect1 = new GRect(55, 55, 200, 200);
      let shapeRect2 = new GRect(100, 100, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Rectangle(shapeRect1, new Pen (PenColour.Black, PenStyle.Solid), true);
      var shape2: Shape = new Rectangle(shapeRect2, new Pen (PenColour.Black, PenStyle.Solid), false);
      shapes.set(shape1.id, shape1);
      shapes.set(shape2.id, shape2);

      var inside: GPoint = new GPoint(75, 75);
      var outside: GPoint = new GPoint(300, 300);
      var crossingLeft: GPoint = new GPoint(55, 75);
      var crossingRight: GPoint = new GPoint(255, 75);

      var controller: ShapeGroupHitTester = new ShapeGroupHitTester(shapes,
         IShapeInteractor.defaultGrabHandleDxDy(),
         IShapeInteractor.defaultHitTestTolerance());

      // Do real hit-testing
      expect(controller.hitTest(inside).hitTest).to.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(outside).hitTest).to.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(crossingLeft).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(crossingRight).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect1.topMiddle).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.bottomMiddle).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.leftMiddle).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.rightMiddle).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect1.topLeft).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.bottomLeft).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.topRight).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect1.bottomRight).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect2.topMiddle).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);

   });

   it("Needs to create ShapeHitTester from class name", function () {

      var hitTester: ShapeHitTester = ShapeHitTesterFactory.create(Rectangle.rectangleID(), 4, 2);

      expect(hitTester).to.not.equal(null);


      // TODO - this is a woraround, remove once streaming framework supports dynamic creation
      hitTester = ShapeHitTesterFactory.create(Shape.shapeID(), 4, 2);

      expect(hitTester).to.not.equal(null);
   });

   it("Needs to not create ShapeHitTester from invalid class name", function () {

      var hitTester: ShapeHitTester = ShapeHitTesterFactory.create("Banana", 4, 2);

      expect(hitTester).to.equal(null);
   });

   it("Needs to create ShapeGroupHitTester and track to a click on a Line", function () {

      let shapeRect2 = new GRect(50, 50, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Line(shapeRect2, new Pen(PenColour.Black, PenStyle.Solid), false);
      var shape2: Shape = new Line(shapeRect2, new Pen(PenColour.Black, PenStyle.Solid), true);
      shapes.set(shape2.id, shape2);
      shapes.set(shape1.id, shape1);

      var inside: GPoint = new GPoint(60, 80);
      var outside: GPoint = new GPoint(300, 300);
      var crossingMid: GPoint = new GPoint(75, 75);

      var controller: ShapeGroupHitTester = new ShapeGroupHitTester(shapes,
         IShapeInteractor.defaultGrabHandleDxDy(),
         IShapeInteractor.defaultHitTestTolerance());

      // Do real hit-testing
      expect(controller.hitTest(inside).hitTest).to.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(outside).hitTest).to.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(crossingMid).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);

      expect(controller.hitTest(shapeRect2.bottomLeft).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
      expect(controller.hitTest(shapeRect2.topRight).hitTest).to.not.equal(ShapeGroupHitTester.noHit().hitTest);
   });
});
