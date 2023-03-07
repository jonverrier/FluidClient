// Copyright (c) 2023 TXPCo Ltd

import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { Interest, Notifier, Notification, NotificationFor } from './NotificationFramework';

export var shapeInteractionComplete: string = "ShapeInteractionComplete";
export var shapeInteractionCompleteInterest = new Interest(shapeInteractionComplete);
export var shapeInteractionAbandoned: string = "ShapeInteractionAbandoned";
export var shapeInteractionAbandonedInterest = new Interest(shapeInteractionAbandoned);
export var shapeKeyboardInteractionComplete: string = "ShapeKeyboardInteractionComplete";
export var shapeKeyboardInteractionCompleteInterest = new Interest(shapeKeyboardInteractionComplete);

var defaultDX: number = 96;
var defaultDY: number = 48;

var minimumDX: number = 88; // Minimum width for a toolbar with two buttons, as used in text shape
var minimumDY: number = 48;

interface IShapeInteractorBase {

   interactionStart(pt: GPoint): void;
   interactionUpdate(pt: GPoint): void;
   interactionEnd(pt: GPoint): void;
   escape(): void;
   rectangle: GRect;
   line: GLine;
}

export interface IShapeKeyboardInteractor {

   delete(): void;
   moveLeft(n: number): void;
   moveRight(n: number): void;
   moveUp(n: number): void;
   moveDown(n: number): void;
}

export abstract class IShapeInteractor extends Notifier implements IShapeInteractorBase {

   abstract interactionStart(pt: GPoint): void;
   abstract interactionUpdate(pt: GPoint): void;
   abstract interactionEnd(pt: GPoint): void;
   abstract rectangle: GRect;
   abstract line: GLine;
   hasUI(): boolean { return false; }; // Override if interactor needs to provide JSX for UI

   // default implementation ends interaction if user presses escape
   escape(): void {
      this.notifyObservers(shapeInteractionAbandonedInterest,
         new Notification(shapeInteractionAbandonedInterest));
   }

   // default implementation confirms interaction if user presses return
   confirm (): void {
      this.notifyObservers(shapeInteractionCompleteInterest,
         new NotificationFor<GRect>(shapeInteractionCompleteInterest, this.rectangle));
   }

   // Going to keep this in the interactor - may need to change handle size depending if we are in touch or mouse mode, which is an interaction thing,
   // not a property of the actual shape. 
   static defaultGrabHandleDxDy(): number {
      return 16;
   }
   // Going to keep this in the interactor - may need to change depending if we are in touch or mouse mode, which is an interaction thing,
   // not a property of the actual shape. 
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

