'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint } from '../src/GeometryPoint';
import { GLine } from '../src/GeometryLine';
import { GRect } from '../src/GeometryRectangle';
import { Interest, ObserverInterest, NotificationRouterFor } from '../src/NotificationFramework';

import { Pen, PenColour, PenStyle } from '../src/Pen';
import { Shape } from '../src/Shape';
import { Rectangle } from '../src/Rectangle';

import { IShapeInteractor, shapeInteractionAbandonedInterest, shapeInteractionCompleteInterest } from '../src/ShapeInteractor';
import {
   NewRectangleInteractor,
   LeftRectangleInteractor, RightRectangleInteractor, TopRectangleInteractor, BottomRectangleInteractor,
   TopLeftRectangleInteractor, TopRightRectangleInteractor, BottomLeftRectangleInteractor, BottomRightRectangleInteractor,
   RectangleMoveInteractor
} from '../src/RectangleInteractors';
import { NewLineInteractor, LineStartInteractor, LineEndInteractor, LineMoveInteractor } from '../src/LineInteractors';
import { KeyboardInteractor } from '../src/ShapeKeyboardInteractor';

describe("IShapeInteractor", function () {

   var escape: boolean = false;
   var confirm: boolean = false;

   it("Needs to provide defaultDXY values", function () {

      expect(IShapeInteractor.defaultDx() > 0).to.equal(true);
      expect(IShapeInteractor.defaultDy() > 0).to.equal(true);
   });

   it("Has no UI", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      expect(interactor.hasUI()).to.equal(false);
   });

   // User presses escape - terminate the interaction
   function onShapeInteractionAbandoned(interest: Interest, data: Notification): void {
      escape = true;
   }

   // User presses escape - terminate the interaction
   function onShapeInteractionConfirm(interest: Interest, data: Notification): void {
      confirm = true;
   }

   it("Needs to process escape", function () {
      var bounds: GRect = new GRect(50, 50, 300, 300);
      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      var shapeInteractionAbndRouter: NotificationRouterFor<GRect> = new NotificationRouterFor<GRect>(onShapeInteractionAbandoned.bind(this));
      var shapeInteractionAbndInterest = new ObserverInterest(shapeInteractionAbndRouter, shapeInteractionAbandonedInterest);
      interactor.addObserver(shapeInteractionAbndInterest);

      expect(escape).to.equal(false);
      interactor.escape();
      expect(escape).to.equal(true);
   });

   it("Needs to process confirm", function () {
      var bounds: GRect = new GRect(50, 50, 300, 300);
      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      var shapeInteractionCmplRouter: NotificationRouterFor<GRect> = new NotificationRouterFor<GRect>(onShapeInteractionConfirm.bind(this));
      var shapeInteractionCmplInterest = new ObserverInterest(shapeInteractionCmplRouter, shapeInteractionCompleteInterest);
      interactor.addObserver(shapeInteractionCmplInterest);

      expect(confirm).to.equal(false);
      interactor.confirm();
      expect(confirm).to.equal(true);
   });
});

describe("FreeRectangleInteractor", function () {

   it("Needs to create FreeRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.dx === IShapeInteractor.minimumDx()).to.equal(true);
      expect(interactor.rectangle.dy === IShapeInteractor.minimumDy()).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(251, 251);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      interactor.interactionStart(pt1);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

describe("RightRectangleInteractor", function () {

   it("Needs to create RightRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(150, 150);

      var interactor: IShapeInteractor = new RightRectangleInteractor(bounds, initial);
 
      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.dx === 100).to.equal(true);
      expect(interactor.rectangle.dy === initial.dy).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var interactor: IShapeInteractor = new RightRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.x === bounds.x).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new RightRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.bottomLeft.equals(initial.bottomLeft)).to.equal(true);
      expect(interactor.rectangle.right === bounds.right).to.equal(true);
   });
});

describe("LeftRectangleInteractor", function () {

   it("Needs to create LeftRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.dx === 150).to.equal(true);
      expect(interactor.rectangle.dy === initial.dy).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var interactor: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.x === bounds.x).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new LeftRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.right === bounds.right).to.equal(true);
   });
});

describe("TopRectangleInteractor", function () {

   it("Needs to create TopRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.dx === initial.dx).to.equal(true);
      expect(interactor.rectangle.top === pt.y).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var interactor: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.y === bounds.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new TopRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.top === bounds.top).to.equal(true);
   });
});

describe("BottomRectangleInteractor", function () {

   it("Needs to create BottomRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomRight);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.y === pt.y).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(75, 75, 200, 200);
      var pt: GPoint = new GPoint(1, 1);

      var interactor: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomRight);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.y === bounds.y).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new BottomRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.bottomRight);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.top === bounds.top).to.equal(true);
   });
});

describe("RectangleMoveInteractor", function () {

   it("Needs to create RectangleMoveInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);

      var interactor: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.topLeft);

      interactor.interactionStart(initial.topLeft);
      interactor.interactionUpdate(initial.topLeft);
      interactor.interactionEnd(initial.topRight);

      expect(interactor.rectangle.dy === initial.dy).to.equal(true);
      expect(interactor.rectangle.dx === initial.dx).to.equal(true);
      expect(interactor.rectangle.x === initial.topRight.x).to.equal(true);
      expect(interactor.rectangle.y === initial.bottomRight.y).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });


   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var pt: GPoint = new GPoint(1, 1);

      var interactor: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.bottomLeft);

      interactor.interactionStart(initial.bottomLeft);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.dy === initial.dy).to.equal(true);
      expect(interactor.rectangle.dx === initial.dx).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });
   
   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(50, 50, 200, 200);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new RectangleMoveInteractor(bounds, initial, initial.topRight);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.dy === initial.dy).to.equal(true);
      expect(interactor.rectangle.dx === initial.dx).to.equal(true);
      expect(interactor.rectangle.topRight.equals (bounds.topRight)).to.equal(true);
   });
   
});

describe("TopLeftRectangleInteractor", function () {

   it("Needs to create TopLeftRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 100, 100);
      var final: GPoint = new GPoint(75, 200);

      var interactor: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topLeft);
      interactor.interactionUpdate(final);
      interactor.interactionEnd(final);

      expect(interactor.rectangle.topLeft.equals(final)).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });   

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topLeft);
      interactor.interactionUpdate(final);
      interactor.interactionEnd(final);

      expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topLeft);
      interactor.interactionUpdate(final);
      interactor.interactionEnd(final);

      expect(interactor.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

describe("TopRightRectangleInteractor", function () {

   it("Needs to create TopRightRectangleInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 100, 100);
      var final: GPoint = new GPoint(225, 200);

      var interactor: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(final);
      interactor.interactionEnd(final);

      expect(interactor.rectangle.topRight.equals(final)).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(final);
      interactor.interactionEnd(final);

      expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

  it("Needs to clip final GRect if necessary - upper right", function () {
      var bounds: GRect = new GRect(50, 50, 300, 300);
      var initial: GRect = new GRect(100, 100, 50, 50);
      var final: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

      interactor.interactionStart(initial.topRight);
      interactor.interactionUpdate(final);
      interactor.interactionEnd(final);

      expect(interactor.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

   describe("BottomLeftRectangleInteractor", function () {

      it("Needs to create BottomLeftRectangleInteractor with click and drag", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 100, 100);
         var final: GPoint = new GPoint(75, 75);

         var interactor: IShapeInteractor = new BottomLeftRectangleInteractor(bounds, initial);

         interactor.interactionStart(initial.bottomLeft);
         interactor.interactionUpdate(final);
         interactor.interactionEnd(final);

         expect(interactor.rectangle.bottomLeft.equals(final)).to.equal(true);
         expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
         expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
      });

      
      it("Needs to clip final GRect if necessary - lower left", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(49, 49);

         var interactor: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

         interactor.interactionStart(initial.bottomLeft);
         interactor.interactionUpdate(final);
         interactor.interactionEnd(final);

         expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
      });

      it("Needs to clip final GRect if necessary - upper right", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(351, 351);

         var interactor: IShapeInteractor = new TopLeftRectangleInteractor(bounds, initial);

         interactor.interactionStart(initial.bottomLeft);
         interactor.interactionUpdate(final);
         interactor.interactionEnd(final);

         expect(interactor.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
      });

   });

   describe("BottomRightRectangleInteractor", function () {

      it("Needs to create BottomRightRectangleInteractor with click and drag", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(200, 75);

         var interactor: IShapeInteractor = new BottomRightRectangleInteractor(bounds, initial);

         interactor.interactionStart(initial.bottomRight);
         interactor.interactionUpdate(final);
         interactor.interactionEnd(final);

         expect(interactor.rectangle.bottomRight.equals(final)).to.equal(true);
         expect(interactor.rectangle.bottomLeft.equals(interactor.line.start)).to.equal(true);
         expect(interactor.rectangle.topRight.equals(interactor.line.end)).to.equal(true);
      });

         
      it("Needs to clip final GRect if necessary - lower left", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(49, 49);

         var interactor: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

         interactor.interactionStart(initial.bottomRight);
         interactor.interactionUpdate(final);
         interactor.interactionEnd(final);

         expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
      });

      it("Needs to clip final GRect if necessary - upper right", function () {

         var bounds: GRect = new GRect(50, 50, 300, 300);
         var initial: GRect = new GRect(100, 100, 50, 50);
         var final: GPoint = new GPoint(351, 351);

         var interactor: IShapeInteractor = new TopRightRectangleInteractor(bounds, initial);

         interactor.interactionStart(initial.bottomRight);
         interactor.interactionUpdate(final);
         interactor.interactionEnd(final);
         expect(interactor.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
      });
      
   });

describe("LineInteractor", function () {

   it("Needs to create LineInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new NewLineInteractor(bounds);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.x === pt.x).to.equal(true);
      expect(interactor.rectangle.x === pt.y).to.equal(true);
      expect(interactor.rectangle.dx === 0).to.equal(true);
      expect(interactor.rectangle.dy === 0).to.equal(true);
      expect(interactor.rectangle.bottomLeft.equals(pt)).to.equal(true);
      expect(interactor.rectangle.topRight.equals(pt)).to.equal(true);
      expect(interactor.line.start.equals(interactor.rectangle.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.rectangle.bottomLeft.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var pt1: GPoint = new GPoint(251, 251);
      var pt2: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new NewRectangleInteractor(bounds);

      interactor.interactionStart(pt1);
      interactor.interactionUpdate(pt2);
      interactor.interactionEnd(pt2);

      expect(interactor.rectangle.topRight.equals(bounds.topRight)).to.equal(true);
   });
});

describe("LineStartInteractor", function () {

   it("Needs to create LineStartInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new LineStartInteractor(bounds, line);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.start.x === pt.x).to.equal(true);
      expect(interactor.line.start.y === pt.y).to.equal(true);
      expect(interactor.line.start.equals(interactor.rectangle.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new LineStartInteractor(bounds, line);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.start.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new LineStartInteractor(bounds, line);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.start.equals(bounds.topRight)).to.equal(true);
   });
});

describe("LineEndInteractor", function () {

   it("Needs to create LineEndInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new LineEndInteractor(bounds, line);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);
      expect(interactor.line.end.x === pt.x).to.equal(true);
      expect(interactor.line.end.y === pt.y).to.equal(true);
      expect(interactor.line.start.equals(interactor.rectangle.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new LineEndInteractor(bounds, line);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.end.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new LineEndInteractor(bounds, line);

      interactor.interactionStart(pt);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.end.equals(bounds.topRight)).to.equal(true);
   });
});

describe("LineMoveInteractor", function () {

   it("Needs to create LineMoveInteractor with click and drag", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(100, 100);

      var interactor: IShapeInteractor = new LineMoveInteractor(bounds, line, line.start);

      interactor.interactionStart(line.start);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);
      expect(interactor.line.start.x === pt.x).to.equal(true);
      expect(interactor.line.start.y === pt.y).to.equal(true);
      expect(interactor.line.start.equals(interactor.rectangle.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - lower left", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(49, 49);

      var interactor: IShapeInteractor = new LineMoveInteractor(bounds, line, line.start);

      interactor.interactionStart(line.start);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.start.equals(bounds.bottomLeft)).to.equal(true);
   });

   it("Needs to clip final GRect if necessary - upper right", function () {

      var bounds: GRect = new GRect(50, 50, 300, 300);
      var line: GLine = new GLine(new GPoint(55, 55), new GPoint(200, 200));
      var pt: GPoint = new GPoint(351, 351);

      var interactor: IShapeInteractor = new LineMoveInteractor(bounds, line, line.end);

      interactor.interactionStart(line.end);
      interactor.interactionUpdate(pt);
      interactor.interactionEnd(pt);

      expect(interactor.line.end.equals(bounds.topRight)).to.equal(true);
   });
});

describe("ShapeKeyboardInteractor", function () {

   it("Needs to delete selected items", function () {

      let bounds = new GRect(10, 10, 400, 400);
      let shapeRect1 = new GRect(55, 55, 200, 200);
      let shapeRect2 = new GRect(100, 100, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Rectangle(shapeRect1, new Pen(PenColour.Black, PenStyle.Solid), true);
      var shape2: Shape = new Rectangle(shapeRect2, new Pen(PenColour.Black, PenStyle.Solid), false);
      shapes.set(shape1.id, shape1);
      shapes.set(shape2.id, shape2);

      var interactor: KeyboardInteractor = new KeyboardInteractor(bounds, shapes);

      expect(shapes.size === 2).to.equal(true);
      interactor.delete();
      expect(shapes.size === 1).to.equal(true);
   });

   it("Needs to move selected items left and right", function () {

      let bounds = new GRect(10, 10, 400, 400);
      let shapeRect1 = new GRect(55, 55, 200, 200);
      let shapeRect2 = new GRect(100, 100, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Rectangle(shapeRect1, new Pen(PenColour.Black, PenStyle.Solid), true);
      var shape2: Shape = new Rectangle(shapeRect2, new Pen(PenColour.Black, PenStyle.Solid), false);
      shapes.set(shape1.id, shape1);
      shapes.set(shape2.id, shape2);

      var interactor: KeyboardInteractor = new KeyboardInteractor(bounds, shapes);

      expect(shape1.boundingRectangle.x === 55).to.equal(true);
      interactor.moveLeft(1);
      expect(shape1.boundingRectangle.x === 54).to.equal(true);
      expect(shape2.boundingRectangle.x === 100).to.equal(true);
      interactor.moveRight(1);
      expect(shape1.boundingRectangle.x === 55).to.equal(true);
   });

   it("Needs to move selected items up and down", function () {

      let bounds = new GRect(10, 10, 400, 400);
      let shapeRect1 = new GRect(55, 55, 200, 200);
      let shapeRect2 = new GRect(100, 100, 50, 50);
      let shapes = new Map<string, Shape>();

      var shape1: Shape = new Rectangle(shapeRect1, new Pen(PenColour.Black, PenStyle.Solid), true);
      var shape2: Shape = new Rectangle(shapeRect2, new Pen(PenColour.Black, PenStyle.Solid), false);
      var shape3: Shape = new Rectangle(shapeRect2, new Pen(PenColour.Black, PenStyle.Solid), true);
      shapes.set(shape1.id, shape1);
      shapes.set(shape2.id, shape2);
      shapes.set(shape3.id, shape3);

      var interactor: KeyboardInteractor = new KeyboardInteractor(bounds, shapes);

      expect(shape1.boundingRectangle.y === 55).to.equal(true);
      interactor.moveUp(1);
      expect(shape1.boundingRectangle.y === 56).to.equal(true);
      expect(shape2.boundingRectangle.y === 100).to.equal(true);
      interactor.moveDown(1);
      expect(shape1.boundingRectangle.y === 55).to.equal(true);
   });
});