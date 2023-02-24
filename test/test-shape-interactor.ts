'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { Shape, ShapeBorderColour, ShapeBorderStyle } from '../src/Shape';
import {
   IShapeInteractor,
   FreeRectangleInteractor,
   LeftRectangleInteractor, RightRectangleInteractor, TopRectangleInteractor, BottomRectangleInteractor,
   TopLeftRectangleInteractor, TopRightRectangleInteractor, BottomLeftRectangleInteractor, BottomRightRectangleInteractor,
   RectangleMoveInteractor,
   HitTestInteractor,
   EHitTestResult
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

      controller.interactionStart(pt);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.dx === FreeRectangleInteractor.minimumDx()).to.equal(true);
      expect(controller.rectangle.dy === FreeRectangleInteractor.minimumDy()).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(49, 49);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.interactionStart(pt);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(251, 251);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new FreeRectangleInteractor(bounds);

      controller.interactionStart(pt1);
      controller.interactionUpdate(pt2);
      controller.interactionEnd(pt2);

      expect(controller.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

describe("HitTestInteractor", function () {

   it("Needs to create HitTestInteractor and track to a click", function () {

      let bounds = new GRect(50, 50, 500, 500);
      let shapeRect1 = new GRect(55, 55, 200, 200);
      let shapeRect2 = new GRect(100, 100, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Shape(shapeRect1, ShapeBorderColour.Black, ShapeBorderStyle.Solid, true);
      var shape2: Shape = new Shape(shapeRect2, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      shapes.set(shape1.id, shape1);
      shapes.set(shape2.id, shape2);

      var inside: GPoint = new GPoint(75, 75);
      var outside: GPoint = new GPoint(300, 300);
      var crossingLeft: GPoint = new GPoint(55, 75);
      var crossingRight: GPoint = new GPoint(255, 75);

      var controller: HitTestInteractor = new HitTestInteractor(shapes, bounds, IShapeInteractor.defaultGrabHandleDxDy());

      // Not doing anything, just call the functions for coverage
      expect(controller.interactionUpdate(inside)).to.equal(false);
      expect(controller.interactionEnd(inside)).to.equal(false);
      expect(controller.interactionStart(inside)).to.equal(false);

      expect(controller.rectangle.equals(bounds)).to.equal(true);
      expect(controller.shapes === shapes).to.equal(true);
      expect(controller.lastHitTest === EHitTestResult.None).to.equal(true);
      expect(controller.lastHitShape === null).to.equal(true);

      // Do real hit-testing
      expect(controller.interactionUpdate(inside)).to.equal(false);
      expect(controller.interactionUpdate(outside)).to.equal(false);
      expect(controller.interactionUpdate(crossingLeft)).to.equal(true);
      expect(controller.interactionUpdate(crossingRight)).to.equal(true);

      expect(controller.interactionUpdate(shapeRect1.topMiddle)).to.equal(true);
      expect(controller.interactionUpdate(shapeRect1.bottomMiddle)).to.equal(true);
      expect(controller.interactionUpdate(shapeRect1.leftMiddle)).to.equal(true);
      expect(controller.interactionUpdate(shapeRect1.rightMiddle)).to.equal(true);

      expect(controller.interactionUpdate(shapeRect1.topLeft)).to.equal(true);
      expect(controller.interactionUpdate(shapeRect1.bottomLeft)).to.equal(true);
      expect(controller.interactionUpdate(shapeRect1.topRight)).to.equal(true);
      expect(controller.interactionUpdate(shapeRect1.bottomRight)).to.equal(true);

      expect(controller.interactionUpdate(shapeRect2.topMiddle)).to.equal(true);

   });
});

describe("RightRectangleInteractor", function () {

   it("Needs to create RightRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new RightRectangleInteractor(bounds, initial);
 
      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.dx === 50).to.equal(true);
      expect(controller.rectangle.dy === initial.dy).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new RightRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.x === bounds.x).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new RightRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt2);
      controller.interactionEnd(pt2);

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

      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.dx === 150).to.equal(true);
      expect(controller.rectangle.dy === initial.dy).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.x === bounds.x).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt2);
      controller.interactionEnd(pt2);

      expect(controller.rectangle.right === bounds.right).to.equal(true);
   });
});

describe("TopRectangleInteractor", function () {

   it("Needs to create TopRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.dx === initial.dx).to.equal(true);
      expect(controller.rectangle.top === pt.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.y === bounds.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(pt2);
      controller.interactionEnd(pt2);

      expect(controller.rectangle.top === bounds.top).to.equal(true);
   });
});

describe("BottomRectangleInteractor", function () {

   it("Needs to create BottomRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomRight);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.y === pt.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomRight);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.y === bounds.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.bottomRight);
      controller.interactionUpdate(pt2);
      controller.interactionEnd(pt2);

      expect(controller.rectangle.top === bounds.top).to.equal(true);
   });
});

describe("RectangleMoveInteractor", function () {

   it("Needs to create RectangleMoveInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);

      var controller: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.topLeft);

      controller.interactionStart(initial.topLeft);
      controller.interactionUpdate(initial.topLeft);
      controller.interactionEnd(initial.topRight);

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

      controller.interactionStart(initial.bottomLeft);
      controller.interactionUpdate(pt);
      controller.interactionEnd(pt);

      expect(controller.rectangle.dy === initial.dy).to.equal(true);
      expect(controller.rectangle.dx === initial.dx).to.equal(true);
      expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });
   
   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.topRight);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(pt2);
      controller.interactionEnd(pt2);

      expect(controller.rectangle.dy === initial.dy).to.equal(true);
      expect(controller.rectangle.dx === initial.dx).to.equal(true);
      expect(controller.rectangle.topRight.equals (bounds.topRight)).to.equal(true);
   });
   
});

describe("TopLeftRectangleInteractor", function () {

   it("Needs to create TopLeftRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(75, 200);

      var controller: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topLeft);
      controller.interactionUpdate(final);
      controller.interactionEnd(final);

      expect(controller.rectangle.topLeft.equals(final)).to.equal(true);
   });   

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(49, 49);

      var controller: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topLeft);
      controller.interactionUpdate(final);
      controller.interactionEnd(final);

      expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topLeft);
      controller.interactionUpdate(final);
      controller.interactionEnd(final);

      expect(controller.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

describe("TopRightRectangleInteractor", function () {

   it("Needs to create TopRightRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(175, 200);

      var controller: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(final);
      controller.interactionEnd(final);

      expect(controller.rectangle.topRight.equals(final)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(49, 49);

      var controller: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(final);
      controller.interactionEnd(final);

      expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

  it("Needs to clip final GRect if necessary - upper right", function () {
      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(351, 351);

      var controller: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

      controller.interactionStart(initial.topRight);
      controller.interactionUpdate(final);
      controller.interactionEnd(final);

      expect(controller.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

   describe("BottomLeftRectangleInteractor", function () {

      it("Needs to create BottomLeftRectangleInteractor with click and drag", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(75, 75);

         var controller: IShapeInteractor = new BottomLeftRectangleInteractor(bounds, initial);

         controller.interactionStart(initial.bottomLeft);
         controller.interactionUpdate(final);
         controller.interactionEnd(final);

         expect(controller.rectangle.bottomLeft.equals(final)).to.equal(true);
      });

      
      it("Needs to clip final GRect if necessary - lower left", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(49, 49);

         var controller: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

         controller.interactionStart(initial.bottomLeft);
         controller.interactionUpdate(final);
         controller.interactionEnd(final);

         expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
      });

      it("Needs to clip final GRect if necessary - upper right", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(351, 351);

         var controller: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

         controller.interactionStart(initial.bottomLeft);
         controller.interactionUpdate(final);
         controller.interactionEnd(final);

         expect(controller.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
      });

   });

   describe("BottomRightRectangleInteractor", function () {

      it("Needs to create BottomRightRectangleInteractor with click and drag", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(200, 75);

         var controller: IShapeInteractor = new BottomRightRectangleInteractor(bounds, initial);

         controller.interactionStart(initial.bottomRight);
         controller.interactionUpdate(final);
         controller.interactionEnd(final);

         expect(controller.rectangle.bottomRight.equals(final)).to.equal(true);
      });

         
      it("Needs to clip final GRect if necessary - lower left", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(49, 49);

         var controller: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

         controller.interactionStart(initial.bottomRight);
         controller.interactionUpdate(final);
         controller.interactionEnd(final);

         expect(controller.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
      });

      it("Needs to clip final GRect if necessary - upper right", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(351, 351);

         var controller: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

         controller.interactionStart(initial.bottomRight);
         controller.interactionUpdate(final);
         controller.interactionEnd(final);
         expect(controller.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
      });
      
   });