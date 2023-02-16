'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { ShapeRendererFactory, ShapeRenderer, SelectionRectangleRenderer, RectangleShapeRenderer } from '../src/ShapeRenderer';
import { Shape, ShapeBorderColour, ShapeBorderStyle, Rectangle, SelectionRectangle } from '../src/Shape';


// TODO - get a better Mick wrking
// e.g. https://www.npmjs.com/package/jest-canvas-mock
// https://github.com/playcanvas/canvas-mock
// Current issue is they dont play nice with CommonJS/Browser build. 
class MockCtx {
   strokeStyle: string;
   fillStyle: string;
   shadowBlur: number;
   shadowColor: string;

   save() { };
   restore() { };
   beginPath() { };
   fillRect(x: number, y: number, dx: number, dy: number) { };
   rect(x: number, y: number, dx: number, dy: number) { };
   stroke() { };
   setLineDash(arr : number[]) { };
}

// import { HTMLCanvasElement } from '@playcanvas/canvas-mock';

describe("ShapeRenderer", function () {

   it("Needs to create SelectionRectangle Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create("SelectionRectangle");

      expect(renderer === null).to.equal(false);
   });

   it("Needs to create Rectangle Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create("Rectangle");

      expect(renderer === null).to.equal(false);
   });

   it("Needs to fail false shapes", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create("blah");

      expect(renderer === null).to.equal(true);
   });

   it("Needs to draw a SelectionRectangle", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new SelectionRectangleRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new SelectionRectangle(rect);

      var caught: boolean = false;

      try {
         renderer.draw(ctx, shape)
      }
      catch (e) {
         // TODO - this is a pretty dumb test - just check there are no exceptions
         caught = true;
      }

      expect(caught === false).to.equal(true);
   });

   it("Needs to draw a Rectangle", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new RectangleShapeRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Dotted, true);

      var caught: boolean = false;

      try {
         // TODO - this is a pretty dumb test - just check there are no exceptions
         renderer.draw(ctx, shape)
      }
      catch (e) {
         caught = true;
      }

      expect(caught === false).to.equal(true);
   });
});

