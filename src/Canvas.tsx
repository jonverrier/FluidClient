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
import { Interest, Notification, NotificationFor, ObserverInterest, NotificationRouter, NotificationRouterFor } from './NotificationFramework';
import { Pen, PenColour, PenStyle } from "./Pen";
import { Shape} from './Shape';
import { Rectangle, SelectionRectangle } from './Rectangle';
import { TextShape } from './Text';
import { Line } from './Line';
import { CaucusOf } from './Caucus';
import { EUIActions, ECanvasMode } from './CanvasModes';
import { IShapeInteractor, shapeInteractionCompleteInterest, shapeInteractionAbandonedInterest } from './ShapeInteractor';
import {
   NewRectangleInteractor,
   LeftRectangleInteractor, RightRectangleInteractor, TopRectangleInteractor, BottomRectangleInteractor,
   TopLeftRectangleInteractor, TopRightRectangleInteractor, BottomLeftRectangleInteractor, BottomRightRectangleInteractor,
   RectangleMoveInteractor
} from './RectangleInteractors';
import { NewTextInteractor, TextEditInteractor } from './TextInteractors';
import { NewLineInteractor, LineStartInteractor, LineEndInteractor, LineMoveInteractor } from './LineInteractors';
import { ShapeGroupHitTester, EHitTest } from './ShapeHitTester';
import { ShapeRendererFactory } from './ShapeRenderer'; 

import { RectangleHitTester } from "../src/RectangleHitTester";
import { LineHitTester } from "../src/LineHitTester";

// Hit testers are hooked up at runtime - have to manually pull them into the transpile set
var rcht: RectangleHitTester = new RectangleHitTester(1, 1);
var lht: LineHitTester = new LineHitTester(1, 1);

import { TextShapeRenderer } from "./TextRenderer";
import { SelectionRectangleRenderer, RectangleShapeRenderer } from "./RectangleRenderer";
import { SelectionLineRenderer, LineShapeRenderer } from "./LineRenderer";

// Rendereres are hooked up at runtime - have to manually pull them into the transpile set
var srcr: SelectionRectangleRenderer = new SelectionRectangleRenderer();
var slr: SelectionLineRenderer = new SelectionLineRenderer();
var rcr: RectangleShapeRenderer = new RectangleShapeRenderer();
var lr: LineShapeRenderer = new LineShapeRenderer();
var tr: TextShapeRenderer = new TextShapeRenderer();

import { CanvasTextEdit } from "./CanvasTextEdit";
import { fontMetrics } from "./CanvasFontMetrics";
import { KeyboardInteractor } from './ShapeKeyboardInteractor';

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
   shapes_ : Map<string, Rectangle>)
   : Promise<void> {
   var promise: Promise<void>;

   promise = new Promise<void>((resolve, reject) => {

      shapes_.forEach((shape: Shape, key: string) => { 

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

   mode: ECanvasMode;
   shapeCaucus: CaucusOf<Shape>;
   outerDivId: string;
}

// DEVELOPMENT NOTE
// Update this for every style of interaction
function shapeInteractorFromMode(mode_: ECanvasMode,
   bounds_: GRect,
   initial_: GRect,
   hitTest_: EHitTest,
   pt_: GPoint): IShapeInteractor {

   switch (mode_) {
      case ECanvasMode.Rectangle:
         return new NewRectangleInteractor(bounds_);

      case ECanvasMode.Line:
         return new NewLineInteractor(bounds_);

      case ECanvasMode.Text:
         return new NewTextInteractor(bounds_);

      case ECanvasMode.Select:
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
   const canvasId = "innerCanvasId";

   function useCanvas(ref: React.MutableRefObject<any>,
      shapes_: Map<string, Shape>,
      lastHit_: EHitTest): [CanvasState, React.Dispatch<React.SetStateAction<CanvasState>>] {

      const [localCanvasState, setLocalCanvasState] = useState<CanvasState>(new CanvasState(canvasWidth, canvasHeight, shapes_, lastHit_));

      useEffect(() => {

         // Anything in here is fired on component mount.
         if (props.shapeCaucus) {

            props.shapeCaucus.addObserver(addedInterest);
            props.shapeCaucus.addObserver(changedInterest);
            props.shapeCaucus.addObserver(removedInterest);
         }

         const canvasObj = ref.current;
         const ctx = canvasObj.getContext('2d');

         let element = getCanvasElementFromId(canvasId);
         let fm = fontMetrics(element); 
         ctx.textAlign = 'left';
         ctx.textBaseline = 'top';
         ctx.font = fm.font;
         ctx.lineHeight = fm.lineHeight;

         // draw background first
         drawBackground(ctx).then(() => {

            // then shapes
            drawShapes(ctx, localCanvasState.shapes);

         }).then(() => {

            // then draw selection 
            if (localCanvasState.shapeInteractor) {
               switch (props.mode) {
                  case ECanvasMode.Line:
                     drawSelectionLine(ctx, localCanvasState.shapeInteractor.rectangle);
                     break;

                  case ECanvasMode.Rectangle:
                     drawSelectionRect(ctx, localCanvasState.shapeInteractor.rectangle);
                     break;

                  case ECanvasMode.Text:
                     drawSelectionRect(ctx, localCanvasState.shapeInteractor.rectangle);
                     break;

                  case ECanvasMode.Select:
                  default:
                     if (lastHit === EHitTest.Start || lastHit === EHitTest.End || lastHit === EHitTest.Line) {
                        drawSelectionLine(ctx, localCanvasState.shapeInteractor.rectangle);
                     } else {
                        drawSelectionRect(ctx, localCanvasState.shapeInteractor.rectangle);
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

            if (localCanvasState.shapeInteractor) {

               localCanvasState.shapeInteractor.removeObserver(shapeInteractionCmplInterest);
               localCanvasState.shapeInteractor.removeObserver(shapeInteractionAbndInterest);
            }
         }
      });

      return [localCanvasState, setLocalCanvasState];
   }

   // Declare state context before callback functions
   const [canvasState, setCanvasState] = useCanvas(canvasRef,
      props.shapeCaucus ? props.shapeCaucus.current() : new Map<string, Shape>,
      lastHit
   );

   // Set up variables needed to hook into Notification Framework
   var caucusRouter: NotificationRouterFor<string>;
   caucusRouter = new NotificationRouterFor<string>(onCaucusChange.bind(canvasState));
   var addedInterest: ObserverInterest = new ObserverInterest(caucusRouter, CaucusOf.caucusMemberAddedInterest);
   var changedInterest: ObserverInterest = new ObserverInterest(caucusRouter, CaucusOf.caucusMemberChangedInterest);
   var removedInterest: ObserverInterest = new ObserverInterest(caucusRouter, CaucusOf.caucusMemberRemovedInterest);

   var lastHit: EHitTest;

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

   // const handleCanvasKeyPress =
   // User presses escape - terminate the interaction
   function onShapeInteractionAbandoned (interest: Interest, data: Notification): void {

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: EHitTest.None,
         shapeInteractor: null,
         resizeShapeId: null
      });
   }

   // This function does not directly reset React state
   // That is left for the interactionStart, Update, and End functions
   function onShapeInteractionComplete(interest: Interest, data: NotificationFor<GRect>) {

      switch (props.mode) {
         case ECanvasMode.Line:
            clearSelection();

            // Create new shape - selected
            let line = new Line(data.eventData, new Pen(PenColour.Black, PenStyle.Solid), true);

            // set the version in Caucus first, which pushes to other clients, then reset our state to match
            props.shapeCaucus.add(line.id, line);
            canvasState.shapes.set(line.id, line);
            break;

         case ECanvasMode.Text:
            clearSelection();

            // Create new Textedit interactor once the location has been picked 
            let interactor = new TextEditInteractor(data.eventData);

            // Force re-render with the new interactor, but with re-size finished. 
            setCanvasState({
               width: canvasState.width, height: canvasState.height,
               shapes: canvasState.shapes,
               lastHit: lastHit,
               shapeInteractor: interactor,
               resizeShapeId: null
            });
            break;

         case ECanvasMode.Rectangle:
            clearSelection();

            // Create new shape - selected
            let rectangle = new Rectangle(data.eventData, new Pen(PenColour.Black, PenStyle.Solid), true);

            // set the version in Caucus first, which pushes to other clients, then reset our state to match
            props.shapeCaucus.add(rectangle.id, rectangle);
            canvasState.shapes.set(rectangle.id, rectangle);
            break;

         case ECanvasMode.Select:
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

   // DEVELOPMENT NOTE
   // Update this for every style of interaction
   function cursorStylesFromModeAndLastHit(mode_: ECanvasMode, lastHit_: EHitTest): string {
      switch (mode_) {
         case ECanvasMode.Line:
            return cursorDrawClasses.root;

         case ECanvasMode.Rectangle:
            return cursorDrawClasses.root;

         case ECanvasMode.Text:
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


   function clearSelection(): void {
      // Clear previous selections
      canvasState.shapes.forEach((shape: Shape, key: string) => {
         shape.isSelected = false;
         props.shapeCaucus.amend(shape.id, shape);
      });
   }

   function getCanvasElementFromId(id: string): HTMLElement {

      return document.getElementById(id);
   }

   function getCanvasFromId (id: string): HTMLCanvasElement {

      return document.getElementById(id) as HTMLCanvasElement;
   }

   function getCanvasOffsetFromId (id: string): GPoint {

      let canvas = getCanvasFromId(id);
      let rect = canvas.getBoundingClientRect();

      return new GPoint(rect.left, rect.top);
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

      // Create the right interactor
      let shapeInteractor = shapeInteractorFromMode(props.mode,
         bounds,
         resizeShape ? resizeShape.boundingRectangle : new GRect(),
         lastHit, coord);

      // Hook up observer functions
      shapeInteractor.addObserver(shapeInteractionCmplInterest);
      shapeInteractor.addObserver(shapeInteractionAbndInterest);

      // Tell interactor to start
      shapeInteractor.interactionStart(coord);

      // Put focus in the canvas for keyboard processing, do not scroll as it is visually disturbing
      //var focusOptions = { preventScroll: true, focusVisible: false };
      //getCanvasElementFromId(canvasId).focus(focusOptions);

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

      let nextShapeInteractor: IShapeInteractor = null;

      if (canvasState.shapeInteractor) {
         canvasState.shapeInteractor.interactionEnd(coord);

         if (props.mode === ECanvasMode.Text && (!canvasState.shapeInteractor.hasUI())) {
            nextShapeInteractor = new TextEditInteractor(canvasState.shapeInteractor.rectangle);
         }
      }
      else {
         nextShapeInteractor = null;
      }

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: EHitTest.None,
         shapeInteractor: nextShapeInteractor,
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

      // Force a re-render if there is an interaction going on, or the hit test has changed.
      // This specifically filters out re-render when the user is just moving the mouse about. 
      if (canvasState.shapeInteractor || (lastHit !== canvasState.lastHit)) {
         setCanvasState({
            width: canvasState.width, height: canvasState.height,
            shapes: canvasState.shapes,
            lastHit: lastHit,
            shapeInteractor: canvasState.shapeInteractor,
            resizeShapeId: canvasState.resizeShapeId
         });
      }
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

   function bounds(): GRect {
      return new GRect(0, 0, canvasState.width, canvasState.height);
   }

   function forceRefresh(): void {

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: canvasState.lastHit,
         shapeInteractor: canvasState.shapeInteractor,
         resizeShapeId: canvasState.resizeShapeId
      });
   }

   const handleCanvasKeyPress = (event: KeyboardEvent): void => {

      var processed : boolean = false;

      switch (event.key) {

         case "ArrowLeft":
            var keyboard = new KeyboardInteractor(bounds(), canvasState.shapes);
            keyboard.moveLeft(8);
            forceRefresh();
            processed = true;
            break;

         case "ArrowRight":
            var keyboard = new KeyboardInteractor(bounds(), canvasState.shapes);
            keyboard.moveRight(8);
            forceRefresh();
            processed = true;
            break;

         case "ArrowUp":
            var keyboard = new KeyboardInteractor(bounds(), canvasState.shapes);
            keyboard.moveDown(8); // HTML origin is top left, opposite sense to cartesian origin
            forceRefresh();
            processed = true;
            break;

         case "ArrowDown":
            var keyboard = new KeyboardInteractor(bounds(), canvasState.shapes);
            keyboard.moveUp(8); // HTML origin is top left, opposite sense to cartesian origin
            forceRefresh();
            processed = true;
            break;

         case 'Delete':
            var keyboard = new KeyboardInteractor(bounds(), canvasState.shapes);
            keyboard.delete();
            forceRefresh();
            processed = true;
            break;

         case 'Escape':
            if (canvasState.shapeInteractor) {
               canvasState.shapeInteractor.escape();
               forceRefresh();
               processed = true;
            }
            break;

         case 'Return':
            if (canvasState.shapeInteractor) {
               canvasState.shapeInteractor.confirm ();
            }
            clearSelection();
            processed = true;
            forceRefresh();
            break;

         default:
            break;
      }

      if (processed) {
         event.stopPropagation();
         event.preventDefault();
      }
   }

   function onTextEditSelect(tool: EUIActions, text: string) {

      if (tool === EUIActions.Ok) {
         let shape = new TextShape(text, canvasState.shapeInteractor.rectangle, new Pen(PenColour.Black, PenStyle.Solid), true);

         // set the version in Caucus first, which pushes to other clients, then reset our state to match
         props.shapeCaucus.add(shape.id, shape);
         canvasState.shapes.set(shape.id, shape);
      }

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         lastHit: EHitTest.None,
         shapeInteractor: null,
         resizeShapeId: null
      });
   }

   var shapeInteractionCmplRouter: NotificationRouterFor<GRect> = new NotificationRouterFor<GRect>(onShapeInteractionComplete);
   var shapeInteractionCmplInterest = new ObserverInterest(shapeInteractionCmplRouter, shapeInteractionCompleteInterest);

   var shapeInteractionAbndRouter: NotificationRouter = new NotificationRouter(onShapeInteractionAbandoned);
   var shapeInteractionAbndInterest = new ObserverInterest(shapeInteractionAbndRouter, shapeInteractionAbandonedInterest);

   // Calculate position for the text edit UI
   var rc: GRect;

   if (canvasState.shapeInteractor && canvasState.shapeInteractor.hasUI()) {
      rc = new GRect (canvasState.shapeInteractor.rectangle);
      var pt: GPoint = getCanvasOffsetFromId(canvasId);
      rc.y = rc.y + pt.y;
   }

   let outerDiv = document.getElementById(props.outerDivId);
   if (outerDiv) {
      let opts = { preventScroll: true, focusVisible: false };
      outerDiv.onkeydown = handleCanvasKeyPress.bind(canvasState);
      outerDiv.focus(opts);
   }

   return (
      <div>
         <div className={cursorStylesFromModeAndLastHit(props.mode, canvasState.lastHit)}>
            {canvasState.shapeInteractor && canvasState.shapeInteractor.hasUI() ?
               <CanvasTextEdit onToolSelect={onTextEditSelect} initialText={""} boundary={rc} /> :
               <div></div>
            }
            <canvas
               className="App-canvas"      
               style = {{ touchAction: 'none' }}      // Stops scoll on touch on mobile/iPad   
               ref={canvasRef as any}
               width={canvasWidth as any}
               height={canvasHeight as any}
               id={canvasId}
               onMouseDown={handleCanvasMouseDown.bind(canvasState)}
               onMouseMove={handleCanvasMouseMove.bind(canvasState)}
               onMouseUp={handleCanvasMouseUp.bind(canvasState)}
               onTouchStart={handleCanvasTouchStart.bind(canvasState) as any}
               onTouchMove={handleCanvasTouchMove.bind(canvasState) as any}
               onTouchEnd={handleCanvasTouchEnd.bind(canvasState) as any}
               />
         </div>
      </div>);
}
