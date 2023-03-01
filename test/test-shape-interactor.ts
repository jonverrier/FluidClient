'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint } from '../src/GeometryPoint';
import { GLine } from '../src/GeometryLine';
import { GRect } from '../src/GeometryRectangle';

import { IShapeInteractor } from '../src/ShapeInteractor';
import {
   NewRectangleInteractor,
   LeftRectangleInteractor, RightRectangleInteractor, TopRectangleInteractor, BottomRectangleInteractor,
   TopLeftRectangleInteractor, TopRightRectangleInteractor, BottomLeftRectangleInteractor, BottomRightRectangleInteractor,
   RectangleMoveInteractor
} from '../src/RectangleInteractors';
import { NewLineInteractor, LineStartInteractor, LineEndInteractor, LineMoveInteractor } from '../src/LineInteractors';

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