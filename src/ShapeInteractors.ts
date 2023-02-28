// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { Interest, Notifier } from './NotificationFramework';

export var shapeInteractionComplete: string = "ShapeInteractionComplete";
export var shapeInteractionCompleteInterest = new Interest(shapeInteractionComplete);

var defaultDX: number = 96;
var defaultDY: number = 48;

var minimumDX: number = 48;
var minimumDY: number = 48;

interface IShapeMover {

   interactionStart(pt: GPoint): boolean;
   interactionUpdate(pt: GPoint): boolean;
   interactionEnd(pt: GPoint): boolean;
   rectangle: GRect;
}

export abstract class IShapeInteractor extends Notifier implements IShapeMover {

   abstract interactionStart(pt: GPoint): boolean;
   abstract interactionUpdate(pt: GPoint): boolean;
   abstract interactionEnd(pt: GPoint): boolean;
   abstract rectangle: GRect;
   abstract line: GLine;

   // Going to keep this in the interactor - may need to change handle size depending if we are in touch or mouse mode, which is an interaction thing,
   // Not a property of rectangles
   static defaultGrabHandleDxDy(): number {
      return 16;
   }
   // Going to keep this in the interactor - may need to change handle size depending if we are in touch or mouse mode, which is an interaction thing,
   static defaultHitTestTolerance(): number {
      return 2;
   }
   static defaultDx(): number {
      return defaultDX;
   }
   static defaultDy(): number {
      return defaultDY;
   }
   static minimumDx(): number {
      return minimumDX;
   }
   static minimumDy(): number {
      return minimumDY;
   }
}

