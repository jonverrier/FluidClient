// Copyright (c) 2023 TXPCo Ltd

import { GPoint, GRect } from "./Geometry";
import { Shape, ShapeBorderColour, ShapeBorderStyle, } from "./Shape"; 

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
export abstract class ShapeRenderer {

   /**
    * Create an empty ShapeRenderer object 
    */
   constructor() {

   }

   // Helper function as many derived classes will need it
   protected drawBorder(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      ctx.save();

      ctx.strokeStyle = "#393D47";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.rect(shape.boundingRectangle.x, shape.boundingRectangle.y, shape.boundingRectangle.dx, shape.boundingRectangle.dy);
      ctx.stroke();

      ctx.restore();
   }

   // Helper function as many derived classes will need it
   protected drawSelectionBorder(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      ctx.save();

      ctx.strokeStyle = "#393D47";
      ctx.fillStyle = "#393D47";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "green";

      let handles = GRect.createGrabHandlesAround(shape.boundingRectangle, 8, 8);

      handles.forEach((handle: GRect) => {

         ctx.beginPath();
         ctx.fillRect(handle.x, handle.y, handle.dx, handle.dy);
         ctx.stroke();
      });

      ctx.restore();
   }

   // to be overriden by derived classes. 
   abstract draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void;
}

/// <summary>
/// SelectionRectangleRenderer - draws Rectangle shapes
/// <summary>
export class SelectionRectangleRenderer extends ShapeRenderer {

   /**
    * Create an empty SelectionRectangleRenderer object 
    */
   constructor() {

      super();
   }

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      this.drawBorder(ctx, shape);
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   private static _factoryForSelectionRectangle: ShapeRendererFactory = new ShapeRendererFactory("SelectionRectangle", SelectionRectangleRenderer.createInstance);
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

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      this.drawBorder(ctx, shape);

      if (shape.isSelected) {
         this.drawSelectionBorder(ctx, shape);
      }
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   private static _factoryForRectangle: ShapeRendererFactory = new ShapeRendererFactory("Rectangle", RectangleShapeRenderer.createInstance);
}
