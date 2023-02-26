// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from "./GeometryPoint";
import { GRect } from "./GeometryRectangle";
import { GLine } from "./GeometryLine";
import { Shape } from "./Shape";

// Signature for the factory function 
type FactoryFunctionFor<ShapeRenderer> = () => ShapeRenderer;

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
/// ShapeRenderer - common super class for shape renderers
/// <summary>
export abstract class ShapeRenderer {

   /**
    * Create an empty ShapeRenderer object 
    */
   constructor() {

   }

   // Helper function as many derived classes will need it
   protected drawLine(ctx: CanvasRenderingContext2D,
      shape: Shape, dashed: boolean): void {

      ctx.save();

      ctx.strokeStyle = "#393D47";
      if (dashed)
         ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(shape.boundingRectangle.x, shape.boundingRectangle.y);
      ctx.lineTo(shape.boundingRectangle.x + shape.boundingRectangle.dx,
                 shape.boundingRectangle.y + shape.boundingRectangle.dy);
      ctx.stroke();

      ctx.restore();
   }

   // Helper function as many derived classes will need it
   protected drawLineSelectionBorder(ctx: CanvasRenderingContext2D,
      shape: Shape, grabHandleDxy: number): void {

      ctx.save();

      ctx.strokeStyle = "#393D47";
      ctx.fillStyle = "#393D47";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "yellow";

      ctx.beginPath();
      ctx.moveTo(shape.boundingRectangle.x, shape.boundingRectangle.y);
      ctx.lineTo(shape.boundingRectangle.x + shape.boundingRectangle.dx,
         shape.boundingRectangle.y + shape.boundingRectangle.dy);
      ctx.stroke();

      let handles = GLine.createGrabHandlesAround(new GLine(new GPoint(shape.boundingRectangle.x, shape.boundingRectangle.y),
                                                            new GPoint(shape.boundingRectangle.x+shape.boundingRectangle.dx, 
                                                                       shape.boundingRectangle.y+shape.boundingRectangle.dy)),
                                                  grabHandleDxy, grabHandleDxy);

      handles.forEach((handle: GRect) => {

         ctx.beginPath();
         ctx.fillRect(handle.x, handle.y, handle.dx, handle.dy);
         ctx.stroke();
      });

      ctx.restore();
   }

   // Helper function as many derived classes will need it
   protected drawBorder(ctx: CanvasRenderingContext2D,
      shape: Shape, dashed: boolean): void {

      ctx.save();

      ctx.strokeStyle = "#393D47";
      if (dashed)
         ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.rect(shape.boundingRectangle.x, shape.boundingRectangle.y, shape.boundingRectangle.dx, shape.boundingRectangle.dy);
      ctx.stroke();

      ctx.restore();
   }

   // Helper function as many derived classes will need it
   protected drawSelectionBorder(ctx: CanvasRenderingContext2D,
      shape: Shape, grabHandleDxy: number): void {

      ctx.save();

      ctx.strokeStyle = "#393D47";
      ctx.fillStyle = "#393D47";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "yellow";

      ctx.beginPath();
      ctx.rect(shape.boundingRectangle.x, shape.boundingRectangle.y, shape.boundingRectangle.dx, shape.boundingRectangle.dy);
      ctx.stroke();

      let handles = GRect.createGrabHandlesAround(shape.boundingRectangle, grabHandleDxy, grabHandleDxy);

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

