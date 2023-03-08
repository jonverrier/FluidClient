'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GRect } from '../src/GeometryRectangle';
import { Pen, PenColour, PenStyle } from "../src/Pen";
import { Shape } from '../src/Shape';
import { Rectangle, SelectionRectangle } from '../src/Rectangle';
import { Line, SelectionLine } from '../src/Line';
import { TextShape } from '../src/Text';
import { ShapeRenderer, ShapeRendererFactory } from '../src/ShapeRenderer';
import { RectangleShapeRenderer, SelectionRectangleRenderer } from "../src/RectangleRenderer"; 
import { SelectionLineRenderer, LineShapeRenderer } from "../src/LineRenderer";
import { TextShapeRenderer } from "../src/TextRenderer";

// TODO - get a better Mock wrking
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
   closePath() { };
   fillRect(x: number, y: number, dx: number, dy: number) { };
   rect(x: number, y: number, dx: number, dy: number) { };
   stroke() { };
   setLineDash(arr: number[]) { };
   moveTo(x: number, y: number) { };
   lineTo(x: number, y: number) { };
   textAlign: string;
   textBaseline: string;
   font: string;
   clip() { }
   fillText(textShape: string, x: number, y: number, dx: number) { };
   fill() { };
   measureText(text: string): any {
      return { metrics: { width: 5 } };
   }
   lineHeight: number; // The Canvas puts this on as an extra variable
}

// import { HTMLCanvasElement } from '@playcanvas/canvas-mock';

describe("ShapeRendererFactory", function () {

   it("Needs to create Shape, Rectangle, SelectionRectangle, Line, SelectionLine, Text", function () {

      expect(ShapeRendererFactory.create(Shape.shapeID())).to.not.equal(null);
      expect(ShapeRendererFactory.create(Rectangle.rectangleID())).to.not.equal(null);
      expect(ShapeRendererFactory.create(SelectionRectangle.selectionRectangleID())).to.not.equal(null);
      expect(ShapeRendererFactory.create(Line.lineID())).to.not.equal(null);
      expect(ShapeRendererFactory.create(SelectionLine.selectionLineID())).to.not.equal(null);
      expect(ShapeRendererFactory.create(TextShape.textID())).to.not.equal(null);
   });
});

describe("ShapeRenderer", function () {

   it("Needs to create SelectionRectangle Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create(SelectionRectangle.selectionRectangleID());

      expect(renderer === null).to.equal(false);
   });

   it("Needs to create Rectangle Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create(Rectangle.rectangleID());

      expect(renderer === null).to.equal(false);
   });

   it("Needs to create SelectionLine Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create(SelectionLine.selectionLineID());

      expect(renderer === null).to.equal(false);
   });

   it("Needs to create Line Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create(Line.lineID());

      expect(renderer === null).to.equal(false);
   });

   it("Needs to create TextShape Renderer", function () {

      var renderer: ShapeRenderer = ShapeRendererFactory.create(TextShape.textID());

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
      var shape: Shape = new SelectionRectangle(rect, PenColour.Border);

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
      var shape: Shape = new Rectangle(rect, new Pen (PenColour.Black, PenStyle.Dotted), true);

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

   it("Needs to draw in red", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new RectangleShapeRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new Rectangle(rect, new Pen(PenColour.Red, PenStyle.Solid), true);

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

   it("Needs to draw in None", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new RectangleShapeRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new Rectangle(rect, new Pen(PenColour.Red, PenStyle.None), true);

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

   it("Needs to draw a SelectionLine", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new SelectionLineRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new SelectionRectangle(rect, PenColour.Border);

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

   it("Needs to draw a Line", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new LineShapeRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new SelectionRectangle(rect, PenColour.Border);
      shape.isSelected = true;

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

   it("Needs to draw a TextShape", function () {

      const ctx: any = new MockCtx();

      var renderer: ShapeRenderer = new TextShapeRenderer();

      const rect = new GRect(0, 0, 20, 20);
      var shape: Shape = new TextShape("Hello", rect, new Pen(PenColour.Black, PenStyle.Dotted), true);
      shape.isSelected = true;

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

});

