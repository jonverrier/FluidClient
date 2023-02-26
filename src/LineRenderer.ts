// Copyright (c) 2023 TXPCo Ltd

import { Shape } from "./Shape";
import { IShapeInteractor } from "./CanvasInteractors"; 
import { ShapeRenderer, ShapeRendererFactory } from "./ShapeRenderer"; 
import { Line, SelectionLine } from './Line';

/// <summary>
/// SelectionLineRenderer - draws Line shapes
/// <summary>
export class SelectionLineRenderer extends ShapeRenderer {

   /**
    * Create an empty SelectionLineRenderer object 
    */
   constructor() {

      super();
   }

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      this.drawLine(ctx, shape, true);
   }

   static createInstance(): SelectionLineRenderer {
      return new SelectionLineRenderer();
   }

   private static _factoryForSelectionRectangle: ShapeRendererFactory = new ShapeRendererFactory(SelectionLine.selectionLineID(),
                                                                                                 SelectionLineRenderer.createInstance);
}

/// <summary>
/// LineShapeRenderer - draws Line shapes
/// <summary>
export class LineShapeRenderer extends ShapeRenderer {

   /**
    * Create an empty LineShapeRenderer object 
    */
   constructor() {

      super();
   }

   draw(ctx: CanvasRenderingContext2D,
      shape: Shape): void {

      this.drawLine(ctx, shape, false);

      if (shape.isSelected) {
         this.drawLineSelectionBorder(ctx, shape, IShapeInteractor.defaultGrabHandleDxDy());
      }
   }

   static createInstance(): LineShapeRenderer {
      return new LineShapeRenderer();
   }

   private static _factoryForRectangle: ShapeRendererFactory = new ShapeRendererFactory(Line.lineID(),
                                                                                        LineShapeRenderer.createInstance);
}
