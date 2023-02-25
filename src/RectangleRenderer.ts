// Copyright (c) 2023 TXPCo Ltd

import { Shape } from "./Shape";
import { IShapeInteractor } from "./CanvasInteractors"; 
import { ShapeRenderer, ShapeRendererFactory } from "./ShapeRenderer"; 
import { Rectangle, SelectionRectangle } from "./Rectangle";

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

      this.drawBorder(ctx, shape, true);
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   private static _factoryForSelectionRectangle: ShapeRendererFactory = new ShapeRendererFactory(SelectionRectangle.selectionRectangleID(),
      SelectionRectangleRenderer.createInstance);
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

      this.drawBorder(ctx, shape, false);

      if (shape.isSelected) {
         this.drawSelectionBorder(ctx, shape, IShapeInteractor.defaultGrabHandleDxDy());
      }
   }

   static createInstance(): RectangleShapeRenderer {
      return new RectangleShapeRenderer();
   }

   // TODO - this is a workaround until Caucus can dynamically create the right subtype of shape
   private static _factoryForShape: ShapeRendererFactory = new ShapeRendererFactory(Shape.shapeID(),
      RectangleShapeRenderer.createInstance);

   private static _factoryForRectangle: ShapeRendererFactory = new ShapeRendererFactory(Rectangle.rectangleID(),
      RectangleShapeRenderer.createInstance);
}
