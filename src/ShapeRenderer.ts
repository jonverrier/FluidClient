// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from "./Geometry";
import { ShapeBorderColour, ShapeBorderStyle, } from "./Shape"; 

// Signature for the factory function 
type FactoryFunctionFor<ShapeDrawer> = () => ShapeDrawer;

var firstFactory: ShapeRendererFactory = null;

export class ShapeRendererFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<ShapeRenderer>;
   _nextFactory: ShapeRendererFactory;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<ShapeRenderer>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = null;

      if (firstFactory === null) {
         firstFactory = this;
      } else {
         var nextFactory: ShapeRendererFactory = firstFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string) : ShapeRenderer {
      var nextFactory: ShapeRendererFactory = firstFactory;

      while (nextFactory) {
         if (nextFactory._className === className) {
            return nextFactory._factoryMethod();
         }
         nextFactory = nextFactory._nextFactory;
      }
      return null;
   }
}


/// <summary>
/// ShapeRenderer - common super class for shape drawers
/// <summary>
export class ShapeRenderer {

   /**
    * Create an empty ShapeRenderer object 
    */
   constructor() {

   }

   static createInstance(): ShapeRenderer {
      return new ShapeRenderer();
   }

   private static _factoryShape: ShapeRendererFactory = new ShapeRendererFactory("Shape", ShapeRenderer.createInstance);
}

/// <summary>
/// RectangleShapeRenderer - draws Rectangle shapes
/// <summary>
export class RectangleShapeRenderer extends ShapeRenderer {

   /**
    * Create an empty RectangleShapeRenderer object 
    */
   constructor() {

      super();
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   private static _factoryRectangle: ShapeRendererFactory = new ShapeRendererFactory("Rectangle", RectangleShapeRenderer.createInstance);
}
