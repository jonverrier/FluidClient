'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GRect } from '../src/Geometry';
import { Shape, ShapeBorderColour, ShapeBorderStyle } from '../src/Shape';


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

});


