/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

// Fluent
import {
   makeStyles
} from '@fluentui/react-components';

// Local
import { GPoint } from './GeometryPoint';
import { GLine } from './GeometryLine';
import { GRect } from './GeometryRectangle';
import { Interest, NotificationFor, ObserverInterest, NotificationRouterFor } from './NotificationFramework';
import { Pen, PenColour, PenStyle } from "./Pen";
import { Shape} from './Shape';
import { Rectangle, SelectionRectangle } from './Rectangle';
import { Line } from './Line';
import { CaucusOf } from './Caucus';
import { CanvasMode } from './CanvasModes';
import {
   IShapeInteractor,
   NewRectangleInteractor,
   LeftRectangleInteractor, RightRectangleInteractor, TopRectangleInteractor, BottomRectangleInteractor,
   TopLeftRectangleInteractor, TopRightRectangleInteractor, BottomLeftRectangleInteractor, BottomRightRectangleInteractor,
   RectangleMoveInteractor,
   NewLineInteractor, LineStartInteractor, LineEndInteractor, LineMoveInteractor,
   shapeInteractionCompleteInterest
} from './CanvasInteractors';
import { ShapeGroupHitTester, EHitTest } from './ShapeHitTester';
import { ShapeRendererFactory } from './ShapeRenderer';
import { SelectionRectangleRenderer } from "./RectangleRenderer"; 
import { SelectionLineRenderer } from "./LineRenderer"; 

// Scaling Constants for Canvas
const canvasWidth = 1920; 
const canvasHeight = 1080;

const cursorDefaultStyles = makeStyles({
   root: {
      cursor: 'default'
   },
});

const cursorDrawRectangleStyles = makeStyles({
   root: {
      cursor: 'crosshair'
   },
});

const cursorLeftStyles = makeStyles({
   root: {
      cursor: 'e-resize'
   },
});

const cursorRightStyles = makeStyles({
   root: {
      cursor: 'w-resize'
   },
});

const cursorTopStyles = makeStyles({
   root: {
      cursor: 's-resize' // Geometry coords are 0-0 at lower left - HTML is 0,0 at upper left. 
   },
});

const cursorBottomStyles = makeStyles({
   root: {
      cursor: 'n-resize' // Geometry coords are 0-0 at lower left - HTML is 0,0 at upper left. 
   },
});

const cursorTopLeftStyles = makeStyles({
   root: {
      cursor: 'nesw-resize' // Geometry coords are 0-0 at lower left - HTML is 0,0 at upper left. 
   },
});

const cursorTopRightStyles = makeStyles({
   root: {
      cursor: 'nwse-resize' // Geometry coords are 0-0 at lower left - HTML is 0,0 at upper left. 
   },
});

const cursorBottomLeftStyles = makeStyles({
   root: {
      cursor: 'nwse-resize' // Geometry coords are 0-0 at lower left - HTML is 0,0 at upper left. 
   },
});

const cursorBottomRightStyles = makeStyles({
   root: {
      cursor: 'nesw-resize' // Geometry coords are 0-0 at lower left - HTML is 0,0 at upper left. 
   },
});

const cursorBorderStyles = makeStyles({
   root: {
      cursor: 'move' 
   },
});

function drawBackground (ctx: CanvasRenderingContext2D): Promise<void> {

   let img = new Image(512, 384);
   img.src = 'assets/img/board-512x384.png';

   // tesselate with backround image top to bottom, left to right
   function innerDraw (ctx: CanvasRenderingContext2D) {
      for (var j = 0; j < ctx.canvas.height; j += img.height) {
         for (var i = 0; i < ctx.canvas.width; i += img.width) {
            ctx.drawImage(img, i, j);
         }
      }
   }
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      img.onload = () => {
         innerDraw(ctx);
         resolve();
      }
   });

   return promise;
};

function drawShapes (ctx: CanvasRenderingContext2D,
   shapes : Map<string, Rectangle>)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      shapes.forEach((shape: Shape, key: string) => { 

         let renderer = ShapeRendererFactory.create(shape.shapeID());

         renderer.draw(ctx, shape);
      });

      resolve();
   });

   return promise;
}

function drawSelectionRect(ctx: CanvasRenderingContext2D,
   selectionRect: GRect)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      var border: Shape = new SelectionRectangle(selectionRect);

      let renderer = new SelectionRectangleRenderer ();

      renderer.draw(ctx, border);

      resolve();
   });

   return promise;
};

function drawSelectionLine(ctx: CanvasRenderingContext2D,
   selectionRect: GRect)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      var border: Shape = new SelectionRectangle(selectionRect);

      let renderer = new SelectionLineRenderer();

      renderer.draw(ctx, border);

      resolve();
   });

   return promise;
};

class CanvasState {

   width: number;
   height: number;
   shapes: Map<string, Shape>;
   lastHit: EHitTest;
   shapeInteractor: IShapeInteractor;
   resizeShapeId: string

   constructor(width_: number, height_: number, shapes_: Map<string, Shape>, lastHit_: EHitTest) {

      this.width = width_;
      this.height = height_;
      this.shapes = shapes_;
      this.lastHit = lastHit_;
      this.resizeShapeId = null;
      this.shapeInteractor = null;
   }
}

export interface ICanvasProps {

   mode: CanvasMode;
   shapeCaucus: CaucusOf<Shape>;
}

// BUILD NOTE
// Update this for every style of interaction
function shapeInteractorFromMode(mode_: CanvasMode,
   bounds_: GRect,
   initial_: GRect,
   hitTest_: EHitTest,
   pt_: GPoint): IShapeInteractor {

   switch (mode_) {
      case CanvasMode.Rectangle:
         return new NewRectangleInteractor(bounds_);

      case CanvasMode.Line:
         return new NewLineInteractor(bounds_);

      case CanvasMode.Select:
         switch (hitTest_) { 

            case EHitTest.Left:
               return new LeftRectangleInteractor(bounds_, initial_);
            case EHitTest.Right:
               return new RightRectangleInteractor(bounds_, initial_);
            case EHitTest.Top:
               return new TopRectangleInteractor(bounds_, initial_);
            case EHitTest.Bottom:
               return new BottomRectangleInteractor(bounds_, initial_);
            case EHitTest.TopLeft:
               return new TopLeftRectangleInteractor(bounds_, initial_);
            case EHitTest.TopRight:
               return new TopRightRectangleInteractor(bounds_, initial_);
            case EHitTest.BottomLeft:
               return new BottomLeftRectangleInteractor(bounds_, initial_);
            case EHitTest.BottomRight:
               return new BottomRightRectangleInteractor(bounds_, initial_);
            case EHitTest.Border:
               return new RectangleMoveInteractor(bounds_, initial_, pt_);
            case EHitTest.Line:
               return new LineMoveInteractor(bounds_, new GLine(new GPoint(initial_.x, initial_.y),
                                                                new GPoint(initial_.x + initial_.dx, initial_.y + initial_.dy)), 
                                             pt_);
            case EHitTest.Start:
               return new LineStartInteractor(bounds_, new GLine(new GPoint(initial_.x, initial_.y),
                                                                 new GPoint(initial_.x + initial_.dx, initial_.y + initial_.dy)));
            case EHitTest.End:
               return new LineEndInteractor(bounds_, new GLine(new GPoint(initial_.x, initial_.y),
                                                               new GPoint(initial_.x + initial_.dx, initial_.y + initial_.dy)));

            default:
            case EHitTest.None:
               return new NewRectangleInteractor(bounds_);
      }

      default:
         return null;
   }
}

export const Canvas = (props: ICanvasProps) => {

   const canvasRef = useRef(null);

   // Set up variables needed to hook into Notification Framework
   var caucusRouter: NotificationRouterFor<string>;
   caucusRouter = new NotificationRouterFor<string>(onCaucusChange.bind(this));
   var addedInterest: ObserverInterest = new ObserverInterest(caucusRouter, CaucusOf.caucusMemberAddedInterest);
   var changedInterest: ObserverInterest = new ObserverInterest(caucusRouter, CaucusOf.caucusMemberChangedInterest);
   var removedInterest: ObserverInterest = new ObserverInterest(caucusRouter, CaucusOf.caucusMemberRemovedInterest);

   var shapeInteractionRouter: NotificationRouterFor<GRect> = new NotificationRouterFor<GRect>(onShapeInteractionComplete.bind(this));
   var shapeInteractionInterest = new ObserverInterest(shapeInteractionRouter, shapeInteractionCompleteInterest);

   function useCanvas(ref: React.MutableRefObject<any>,
      shapes_: Map<string, Shape>,
      lastHit_: EHitTest): [CanvasState, React.Dispatch<React.SetStateAction<CanvasState>>] {

      const [canvasState, setCanvasState] = useState<CanvasState>(new CanvasState(canvasWidth, canvasHeight, shapes_, lastHit_));

      useEffect(() => {

         // Anything in here is fired on component mount.
         if (props.shapeCaucus) {

            props.shapeCaucus.addObserver(addedInterest);
            props.shapeCaucus.addObserver(changedInterest);
            props.shapeCaucus.addObserver(removedInterest);
         }

         const canvasObj = ref.current;
         const ctx = canvasObj.getContext('2d');

         // draw background first
         drawBackground(ctx).then(() => {

            // then shapes
            drawShapes(ctx, canvasState.shapes);

         }).then(() => {

            // then draw selection 
            if (canvasState.shapeInteractor) {
               switch (props.mode) {
                  case CanvasMode.Line:
                     drawSelectionLine(ctx, canvasState.shapeInteractor.rectangle);
                     break;

                  case CanvasMode.Rectangle:
                     drawSelectionRect(ctx, canvasState.shapeInteractor.rectangle);
                     break;

                  case CanvasMode.Select:
                  default:
                     if (lastHit === EHitTest.Start || lastHit === EHitTest.End || lastHit === EHitTest.Line) {
                        drawSelectionLine(ctx, canvasState.shapeInteractor.rectangle);
                     } else {
                        drawSelectionRect(ctx, canvasState.shapeInteractor.rectangle);
                     }
                     break;
               }
            }
         });
         return () => {
            // Anything in here is fired on component unmount.
            if (props.shapeCaucus) {

               props.shapeCaucus.removeObserver (addedInterest);
               props.shapeCaucus.removeObserver (changedInterest);
               props.shapeCaucus.removeObserver(removedInterest);
            }

            if (canvasState.shapeInteractor)
               canvasState.shapeInteractor.removeObserver(shapeInteractionInterest);
         }
      });

      return [canvasState, setCanvasState];
   }

   function onCaucusChange(interest_: Interest, id_: NotificationFor<string>): void {

      let shapes = props.shapeCaucus.current();

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: shapes,
         lastHit: canvasState.lastHit,
         shapeInteractor: canvasState.shapeInteractor,
         resizeShapeId: canvasState.resizeShapeId
      });
   }

   const [canvasState, setCanvasState] = useCanvas(canvasRef,
      props.shapeCaucus ? props.shapeCaucus.current() : new Map<string, Shape>,
      lastHit
   );

   var lastHit: EHitTest; 

   // Dont reset the hit test if there is an interaction going on
   if (canvasState.shapeInteractor) {
      lastHit = canvasState.lastHit;
   } else {
      lastHit = EHitTest.None;
   }
   
   let hitTestInteractor = new ShapeGroupHitTester(canvasState.shapes,
      IShapeInteractor.defaultGrabHandleDxDy(),
      IShapeInteractor.defaultHitTestTolerance());
   let resizeShapeId = canvasState.resizeShapeId;
   
   const cursorDefaultClasses = cursorDefaultStyles();
   const cursorDrawClasses = cursorDrawRectangleStyles();
   const cursorLeftClasses = cursorLeftStyles();
   const cursorRightClasses = cursorRightStyles();
   const cursorTopClasses = cursorTopStyles();
   const cursorBottomClasses = cursorBottomStyles();
   const cursorBorderClasses = cursorBorderStyles();
   const cursorTopLeftClasses = cursorTopLeftStyles();
   const cursorTopRightClasses = cursorTopRightStyles();
   const cursorBottomLeftClasses = cursorBottomLeftStyles();
   const cursorBottomRightClasses = cursorBottomRightStyles();

   // BUILD NOTE
   // Update this for every style of interaction
   function cursorStylesFromModeAndLastHit(mode_: CanvasMode, lastHit_: EHitTest): string {
      switch (mode_) {
         case CanvasMode.Line:
            return cursorDrawClasses.root;

         case CanvasMode.Rectangle:
            return cursorDrawClasses.root;

         default:
            switch (lastHit_) {

               case EHitTest.Left:
                  return cursorLeftClasses.root;
               case EHitTest.Right:
                  return cursorRightClasses.root;
               case EHitTest.Top:
                  return cursorTopClasses.root;
               case EHitTest.Bottom:
                  return cursorBottomClasses.root;
               case EHitTest.TopLeft:
                  return cursorTopLeftClasses.root;
               case EHitTest.TopRight:
                  return cursorTopRightClasses.root;
               case EHitTest.BottomLeft:
                  return cursorBottomLeftClasses.root;
               case EHitTest.BottomRight:
                  return cursorBottomRightClasses.root;
               case EHitTest.Border:
                  return cursorBorderClasses.root;
               case EHitTest.Start:
               case EHitTest.End:
               case EHitTest.Line:
                  return cursorBorderClasses.root;

               default:
                  return cursorDefaultClasses.root;
            }
      }
   }

   function getCanvas(event: MouseEvent | TouchEvent): HTMLCanvasElement {

      var target: HTMLCanvasElement = null;

      if (event.target)
         target = event.target as HTMLCanvasElement;

      return target;
   }

   function getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): GPoint {

      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      return new GPoint(x, y);
   }

   function getFirstTouchPosition(canvas: HTMLCanvasElement, event: TouchEvent): GPoint {

      let rect = canvas.getBoundingClientRect();
      let x = event.changedTouches[0].clientX - rect.left;
      let y = event.changedTouches[0].clientY - rect.top;

      return new GPoint(x, y);
   }

   function getLastTouchPosition(canvas: HTMLCanvasElement, event: TouchEvent): GPoint {

      let rect = canvas.getBoundingClientRect();
      let x = event.changedTouches[event.changedTouches.length - 1].clientX - rect.left;
      let y = event.changedTouches[event.changedTouches.length - 1].clientY - rect.top;

      return new GPoint(x, y);
   }

   // This function does not directly reset React state
   // That is left for the interactionStart, Update, and End functions
   function onShapeInteractionComplete(interest: Interest, data: NotificationFor<GRect>) {

      switch (props.mode) { 
         case CanvasMode.Line:
            // Clear previous selections
            canvasState.shapes.forEach((shape: Shape, key: string) => {
               shape.isSelected = false;
               props.shapeCaucus.amend(shape.id, shape);
            });
            // Create new shape - selected
            let line = new Line(data.eventData, new Pen(PenColour.Black, PenStyle.Solid), true);

            // set the version in Caucus first, which pushes to other clients, then reset our state to match
            props.shapeCaucus.add(line.id, line);
            canvasState.shapes.set(line.id, line);
            break;

         case CanvasMode.Rectangle:
            // Clear previous selections
            canvasState.shapes.forEach((shape: Shape, key: string) => {
               shape.isSelected = false;
               props.shapeCaucus.amend (shape.id, shape);
            });
            // Create new shape - selected
            let rectangle = new Rectangle(data.eventData, new Pen (PenColour.Black, PenStyle.Solid), true);

            // set the version in Caucus first, which pushes to other clients, then reset our state to match
            props.shapeCaucus.add(rectangle.id, rectangle);
            canvasState.shapes.set(rectangle.id, rectangle);
            break;

         case CanvasMode.Select:
         default:
            if (resizeShapeId) {

               // If we are here, User clicked on a border, or a grab handle
               // Set the new size & then push to Caucus
               let shape = canvasState.shapes.get(resizeShapeId);
               shape.boundingRectangle = data.eventData;
               props.shapeCaucus.amend(resizeShapeId, shape);
               resizeShapeId = null;
            }
            else {
               // Else select items within the selection area and de-select others
               canvasState.shapes.forEach((shape: Shape, key: string) => {
                  if (data.eventData.fullyIncludes(shape.boundingRectangle)) {
                     shape.isSelected = true;
                  }
                  else {
                     shape.isSelected = false;
                  }
                  // set the version in Caucus, which pushes to other clients
                  props.shapeCaucus.amend(shape.id, shape);
               });
            }
            break;
      }
   }

   function interactionStart(coord: GPoint, bounds: GRect) : void {

      let hitTest = hitTestInteractor.hitTest(coord);
      let resizeShape: Shape = null;

      if (hitTest.hitTest !== EHitTest.None) {
         lastHit = hitTest.hitTest;
         resizeShape = hitTest.hitShape;
         resizeShapeId = resizeShape.id;
      }
      else {
         lastHit = EHitTest.None;
         resizeShapeId = null;
      }

      // Create the right interactor, and hook up to notifications of when the interaction is complete
      let shapeInteractor = shapeInteractorFromMode(props.mode,
         bounds,
         resizeShape ? resizeShape.boundingRectangle : new GRect(),
         lastHit, coord);

      shapeInteractor.addObserver(shapeInteractionInterest);
      shapeInteractor.interactionStart(coord);

      // Force re-render
      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: lastHit,
         shapeInteractor: shapeInteractor,
         resizeShapeId: resizeShapeId
      });
   }

   function interactionEnd(coord: GPoint): void {

      if (canvasState.shapeInteractor)
         canvasState.shapeInteractor.interactionEnd(coord);

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: EHitTest.None,
         shapeInteractor: null,
         resizeShapeId: resizeShapeId
      });
   }

   function interactionUpdate(coord: GPoint): void {

      if (canvasState.shapeInteractor) {

         // if there is a current interactor, pass it the data
         canvasState.shapeInteractor.interactionUpdate(coord);

      } else {
         // otherwise do a new hit test
         let hitTest = hitTestInteractor.hitTest(coord);
         lastHit = hitTest.hitTest; 
      }

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: lastHit,
         shapeInteractor: canvasState.shapeInteractor,
         resizeShapeId: canvasState.resizeShapeId
      });
   }

   const handleCanvasMouseDown = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      let canvas = getCanvas(event);
      var coord: GPoint = getMousePosition(canvas, event);

      let clientRect = canvas.getBoundingClientRect();
      let bounds = new GRect(0, 0, clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);

      interactionStart(coord, bounds);
   };

   const handleCanvasMouseMove= (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      var coord: GPoint = getMousePosition(getCanvas(event), event);

      interactionUpdate(coord);
   };

   const handleCanvasMouseUp = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      var coord: GPoint = getMousePosition(getCanvas(event), event);

      interactionEnd(coord);
   };

   const handleCanvasTouchStart = (event: TouchEvent): void => {

      event.stopPropagation();

      let canvas = getCanvas(event);
      let coord = getFirstTouchPosition(canvas, event);

      let clientRect = canvas.getBoundingClientRect();
      let bounds = new GRect(0, 0, clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);

      interactionStart(coord, bounds);
   }

   const handleCanvasTouchMove = (event: TouchEvent): void => {

      event.stopPropagation();

      var coord: GPoint = getLastTouchPosition(getCanvas(event), event);

      interactionUpdate(coord);
   }

   const handleCanvasTouchEnd = (event: TouchEvent): void => {

      event.stopPropagation();

      var coord: GPoint = getLastTouchPosition(getCanvas(event), event);

      interactionEnd(coord);
   }


   return (<div className={cursorStylesFromModeAndLastHit(props.mode, canvasState.lastHit)}>
      <canvas
         className="App-canvas"      
         style = {{ touchAction: 'none' }}         
         ref={canvasRef as any}
         width={canvasWidth as any}
         height={canvasHeight as any}
         onMouseDown={handleCanvasMouseDown}
         onMouseMove={handleCanvasMouseMove}
         onMouseUp={handleCanvasMouseUp}
         onTouchStart={handleCanvasTouchStart as any}
         onTouchMove={handleCanvasTouchMove as any}
         onTouchEnd={handleCanvasTouchEnd as any}
   /></div>);
}
