'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GRect } from '../src/Geometry';
import { Shape, ShapeBorderColour, ShapeBorderStyle, Rectangle, SelectionRectangle } from '../src/Shape';


describe("Shape", function () {

   it("Needs to create, test & assign Shape", function () {

      var rect: GRect = new GRect(1, 2, 3, 4);

      var shape1: Shape = new Shape(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      var shape2: Shape = new Shape(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, true);
      var shape3: Shape = new Shape(shape1);
      var shape4: Shape = new Shape();

      expect(shape1.equals(shape1)).to.equal(true);
      expect(shape1.equals(shape2)).to.equal(false);
      expect(shape1.equals(shape3)).to.equal(true);
      expect(shape1.equals(shape4)).to.equal(false);
      expect(shape1.boundingRectangle.equals(rect) === true).to.equal(true);
      expect(shape1.borderColour === ShapeBorderColour.Black).to.equal(true);
      expect(shape1.borderStyle === ShapeBorderStyle.Solid).to.equal(true);
      expect(shape1.isSelected).to.equal(false);
      expect(shape1.id.length > 0).to.equal(true);
      expect(shape1.shapeID().length > 0).to.equal(true);

      shape2.assign(shape1);
      expect(shape1.equals(shape2)).to.equal(true);

      var rect2: GRect = new GRect(5,6,7,8);
      shape1.boundingRectangle = rect2;
      shape1.borderColour = ShapeBorderColour.Red;
      shape1.borderStyle = ShapeBorderStyle.Dashed;
      shape1.isSelected = true;

      expect(shape1.boundingRectangle.equals(rect2) === true).to.equal(true);
      expect(shape1.borderColour === ShapeBorderColour.Red).to.equal(true);
      expect(shape1.borderStyle === ShapeBorderStyle.Dashed).to.equal(true);
      expect(shape1.isSelected).to.equal(true);

      var caught: boolean = false;
      try {
         var shape5: Shape = new Shape(null as Shape);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to convert Shape to and from JSON()", function () {

      var rect: GRect = new GRect(1,2,3,4);

      var shape1: Shape = new Shape(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);

      var stream: string = shape1.streamToJSON();

      var shape2: Shape = new Shape(); 

      expect(shape1.equals(shape2)).to.equal(false);

      shape2.streamFromJSON(stream);

      expect(shape1.equals(shape2)).to.equal(true);
   });

   it("Needs to construct from factoryFn", function () {

      var shape1: Shape = Shape.factoryFn();
      var shape2 = new Shape(shape1);

      expect(shape1.equals (shape2) === true).to.equal(true);
   });

   it("Needs to create and test for nullShape", function () {

      var shape1: Shape = Shape.nullShape();

      expect(shape1.isNull()).to.equal(true);
      expect(Shape.isNull(shape1)).to.equal(true);
   });

});

describe("Rectangle", function () {

   it("Needs to create, test & assign Rectangle", function () {

      var rect: GRect = new GRect(1, 2, 3, 4);

      var shape1: Rectangle = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);
      var shape2: Rectangle = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, true);
      var shape3: Rectangle = new Rectangle(shape1);
      var shape4: Rectangle = new Rectangle();

      expect(shape1.equals(shape1)).to.equal(true);
      expect(shape1.equals(shape2)).to.equal(false);
      expect(shape1.equals(shape3)).to.equal(true);
      expect(shape1.equals(shape4)).to.equal(false);
      expect(shape1.boundingRectangle.equals(rect) === true).to.equal(true);
      expect(shape1.borderColour === ShapeBorderColour.Black).to.equal(true);
      expect(shape1.borderStyle === ShapeBorderStyle.Solid).to.equal(true);
      expect(shape1.isSelected).to.equal(false);
      expect(shape1.id.length > 0).to.equal(true);
      expect(shape1.shapeID().length > 0).to.equal(true);

      shape2.assign(shape1);
      expect(shape1.equals(shape2)).to.equal(true);

      var rect2: GRect = new GRect(5, 6, 7, 8);
      shape1.boundingRectangle = rect2;
      shape1.borderColour = ShapeBorderColour.Red;
      shape1.borderStyle = ShapeBorderStyle.Dashed;
      shape1.isSelected = true;

      expect(shape1.boundingRectangle.equals(rect2) === true).to.equal(true);
      expect(shape1.borderColour === ShapeBorderColour.Red).to.equal(true);
      expect(shape1.borderStyle === ShapeBorderStyle.Dashed).to.equal(true);
      expect(shape1.isSelected).to.equal(true);

      var caught: boolean = false;
      try {
         var shape5: Shape = new Shape(null as Shape);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to convert Rectangle to and from JSON()", function () {

      var rect: GRect = new GRect(1, 2, 3, 4);

      var shape1: Rectangle = new Rectangle(rect, ShapeBorderColour.Black, ShapeBorderStyle.Solid, false);

      var stream: string = shape1.streamToJSON();

      var shape2: Rectangle = new Rectangle();

      expect(shape1.equals(shape2)).to.equal(false);

      shape2.streamFromJSON(stream);

      expect(shape1.equals(shape2)).to.equal(true);
   });

});


describe("SelectionRectangle", function () {

   it("Needs to create, test & assign SelectionRectangle", function () {

      var rect: GRect = new GRect(1, 2, 3, 4);

      var shape1: Rectangle = new SelectionRectangle(rect);
      var shape2: Rectangle = new SelectionRectangle(shape1);
      var shape3: Rectangle = new SelectionRectangle();

      expect(shape1.equals(shape1)).to.equal(true);
      expect(shape1.equals(shape2)).to.equal(true);
      expect(shape1.equals(shape3)).to.equal(false);
      expect(shape1.boundingRectangle.equals(rect) === true).to.equal(true);
      expect(shape1.borderColour === ShapeBorderColour.Border).to.equal(true);
      expect(shape1.borderStyle === ShapeBorderStyle.Dashed).to.equal(true);
      expect(shape1.isSelected).to.equal(false);
      expect(shape1.id.length > 0).to.equal(true);
      expect(shape1.shapeID().length > 0).to.equal(true);

      shape3.assign(shape1);
      expect(shape1.equals(shape3)).to.equal(true);

      var rect2: GRect = new GRect(5, 6, 7, 8);
      shape1.boundingRectangle = rect2;
      shape1.borderColour = ShapeBorderColour.Red;
      shape1.borderStyle = ShapeBorderStyle.Dashed;
      shape1.isSelected = true;

      expect(shape1.boundingRectangle.equals(rect2) === true).to.equal(true);
      expect(shape1.borderColour === ShapeBorderColour.Red).to.equal(true);
      expect(shape1.borderStyle === ShapeBorderStyle.Dashed).to.equal(true);
      expect(shape1.isSelected).to.equal(true);

      var caught: boolean = false;
      try {
         var shape5: Shape = new Shape(null as Shape);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to convert Rectangle to and from JSON()", function () {

      var rect: GRect = new GRect(1, 2, 3, 4);

      var shape1: SelectionRectangle = new SelectionRectangle(rect);

      var stream: string = shape1.streamToJSON();

      var shape2: SelectionRectangle = new SelectionRectangle();

      expect(shape1.equals(shape2)).to.equal(false);

      shape2.streamFromJSON(stream);

      expect(shape1.equals(shape2)).to.equal(true);
   });

});


