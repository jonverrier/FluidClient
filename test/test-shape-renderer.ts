'use strict';

// Copyright TXPCo ltd, 2023
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GPoint, GRect } from '../src/Geometry';
import { ShapeRendererFactory, ShapeRenderer } from '../src/ShapeRenderer';

describe("ShapeDrawer", function () {

   it("Needs to create ShapeDrawer", function () {

      var drawer: ShapeRenderer = ShapeRendererFactory.create("Shape");

      expect(drawer === null).to.equal(false);
   });

   it("Needs to create RectangleShapeDrawer", function () {

      var drawer: ShapeRenderer = ShapeRendererFactory.create("Rectangle");

      expect(drawer === null).to.equal(false);
   });

});

