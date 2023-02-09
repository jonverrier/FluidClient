// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from "./Geometry";
import { ShapeBorderColour, ShapeBorderStyle, } from "./Shape"; 

// Signature for the factory function 
type FactoryFunctionFor<ShapeDrawer> = () => ShapeDrawer;

var firstFactory: ShapeDrawerFactory = null;

export class ShapeDrawerFactory {

   _className: string;
   _factoryMethod: FactoryFunctionFor<ShapeDrawer>;
   _nextFactory: ShapeDrawerFactory;

   constructor(className_: string, factoryMethod_: FactoryFunctionFor<ShapeDrawer>) {
      this._className = className_;
      this._factoryMethod = factoryMethod_;
      this._nextFactory = null;

      if (firstFactory === null) {
         firstFactory = this;
      } else {
         var nextFactory: ShapeDrawerFactory = firstFactory;

         while (nextFactory._nextFactory) {
            nextFactory = nextFactory._nextFactory;
         }
         nextFactory._nextFactory = this;
      }
   }

   static create(className: string) : ShapeDrawer {
      var nextFactory: ShapeDrawerFactory = firstFactory;

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
/// ShapeDrawer - common super class for shape drawers
/// <summary>
export class ShapeDrawer {

   /**
    * Create an empty ShapeDrawer object 
    */
   constructor() {

   }

   static createInstance(): ShapeDrawer {
      return new ShapeDrawer();
   }

   private static _factoryShape: ShapeDrawerFactory = new ShapeDrawerFactory("Shape", ShapeDrawer.createInstance);
}

/// <summary>
/// RectangleShapeDrawer - draws Rectangle shapes
/// <summary>
export class RectangleShapeDrawer extends ShapeDrawer {

   /**
    * Create an empty RectangleShapeDrawer object 
    */
   constructor() {

      super();
   }

   static createInstance(): RectangleShapeDrawer {
      return new RectangleShapeDrawer();
   }

   private static _factoryRectangle: ShapeDrawerFactory = new ShapeDrawerFactory("Rectangle", RectangleShapeDrawer.createInstance);
}
