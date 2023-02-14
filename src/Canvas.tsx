/*! Copyright TXPCo 2022 */

// React
import React, { MouseEvent, useState, useRef, useEffect } from 'react';

// Fluent
import {
   makeStyles
} from '@fluentui/react-components';

// Local
import { GPoint, GRect } from './Geometry';
import { Interest, NotificationFor, ObserverInterest, NotificationRouterFor } from './NotificationFramework';
import { Shape, ShapeBorderColour, ShapeBorderStyle, Rectangle, SelectionRectangle } from './Shape';
import { CaucusOf } from './Caucus';
import { CanvasMode } from './CanvasModes';
import { ShapeInteractor, shapeInteractionCompleteInterest } from './CanvasInteractors';
import { RectangleShapeRenderer, SelectionRectangleRenderer, ShapeRendererFactory } from './ShapeRenderer';

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

         // TODO - this is a plug until can dynamically create shapes and shape renderers
         // And can plug that unto the CaucusOf<Shape>s
         if (!renderer)
            renderer = new RectangleShapeRenderer();

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

class CanvasState {

   width: number;
   height: number;
   shapes: Map<string, Shape>;
   shapeInteractor: ShapeInteractor;

   constructor(width_: number, height_: number, shapes_: Map<string, Shape>) {
      this.width = width_;
      this.height = height_;

      this.shapes = new Map<string, Shape>();
      this.shapeInteractor = null;
   }
}

function useCanvas(ref: React.MutableRefObject<any>, shapes_: Map<string, Shape>): [CanvasState, React.Dispatch<React.SetStateAction<CanvasState>>] {

   const [canvasState, setCanvasState] = useState<CanvasState> (new CanvasState(canvasWidth, canvasHeight, shapes_));

   useEffect(() => {
      const canvasObj = ref.current;
      const ctx = canvasObj.getContext('2d');

      // draw background first
      drawBackground(ctx).then(() => {

         // then shapes
         drawShapes(ctx, canvasState.shapes);

      }).then (() => {

         // then draw selection rectangle
         if (canvasState.shapeInteractor) {
            drawSelectionRect(ctx, canvasState.shapeInteractor.rectangle);
         } 
      });
   });

   return [canvasState, setCanvasState];
}

export interface ICanvasProps {

   mode: CanvasMode;
   shapeCaucus: CaucusOf<Shape>;
}

function shapeInteractorFromMode(mode_: CanvasMode, bounds_: GRect): ShapeInteractor {
   switch (mode_) {
      case CanvasMode.Rectangle:
         return new ShapeInteractor (bounds_);

      case CanvasMode.Select:
         return new ShapeInteractor(bounds_);

      default:
         return null;
   }
}

export const Canvas = (props: ICanvasProps) => {

   const canvasRef = useRef(null);
   const [canvasState, setCanvasState] = useCanvas(canvasRef,
                                                   props.shapeCaucus ? props.shapeCaucus.current() : new Map<string, Shape>);

   const cursorDefaultClasses = cursorDefaultStyles();
   const cursorDrawRectangleClasses = cursorDrawRectangleStyles();

   function cursorStylesFromMode(mode_: CanvasMode): string {
      switch (mode_) {
         case CanvasMode.Rectangle:
            return cursorDrawRectangleClasses.root;

         default:
            return cursorDefaultClasses.root;
      }
   }

   function getCanvas(event: MouseEvent): HTMLCanvasElement {

      var target: HTMLCanvasElement;

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

   const handleCanvasClick = (event: MouseEvent) : void => {

      event.preventDefault();
      event.stopPropagation();

      return; 
   };

   function onShapeInteractionComplete(interest: Interest, data: NotificationFor<GRect>) {

      switch (props.mode) { 
         case CanvasMode.Rectangle:
            // Clear previous selections
            canvasState.shapes.forEach((shape: Shape, key: string) => {
               shape.isSelected = false;
            });
            // Create new shape - selected
            let shape = new Rectangle(data.eventData, ShapeBorderColour.Black, ShapeBorderStyle.Solid, true);

            // set the version in Cuacus first, which pushes to other clients, then reset our state
            props.shapeCaucus.add(shape.id, shape);
            canvasState.shapes.set(shape.id, shape);
            break;
         case CanvasMode.Select:
         default:
            // Select items within the selection area
            canvasState.shapes.forEach((shape: Shape, key: string) => {
               if (data.eventData.fullyIncludes(shape.boundingRectangle)) {
                  shape.isSelected = true;
               }
               else {
                  shape.isSelected = false;
               }
            });
            break;
   }
   }

   const handleCanvasMouseDown = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      var coord: GPoint = getMousePosition(getCanvas(event), event);

      let canvas = getCanvas(event);
      let clientRect = canvas.getBoundingClientRect();
      let bounds = new GRect(0, 0, clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);

      // Create the right interactor, and hook up to notifications of when the interaction is complete
      let shapeInteractor = shapeInteractorFromMode(props.mode, bounds);
      shapeInteractor.mouseDown(coord);

      var notificationRouter: NotificationRouterFor<GRect> = new NotificationRouterFor<GRect>(onShapeInteractionComplete.bind(this)); 
      shapeInteractor.addObserver(new ObserverInterest(notificationRouter, shapeInteractionCompleteInterest));

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: canvasState.shapes,
         shapeInteractor: shapeInteractor
      });

   };

   const handleCanvasMouseMove= (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState.shapeInteractor) {
         var coord: GPoint = getMousePosition(getCanvas(event), event);

         canvasState.shapeInteractor.mouseMove(coord);

         setCanvasState({
            width: canvasState.width, height: canvasState.height,
            shapes: canvasState.shapes,
            shapeInteractor: canvasState.shapeInteractor
         });
      }
   };

   const handleCanvasMouseUp = (event: MouseEvent): void => {

      event.preventDefault();
      event.stopPropagation();

      if (canvasState.shapeInteractor) {
         var coord: GPoint = getMousePosition(getCanvas(event), event);

         canvasState.shapeInteractor.mouseUp(coord);

         setCanvasState({
            width: canvasState.width, height: canvasState.height,
            shapes: canvasState.shapes,
            shapeInteractor: null
         });
      }
   };

   function onCaucusChange(interest_: Interest, id_: NotificationFor<string>): void {

      setCanvasState({
         width: canvasState.width, height: canvasState.height,
         shapes: props.shapeCaucus.current(),
         shapeInteractor: canvasState.shapeInteractor
      });
   }

   if (props.shapeCaucus) {
      var router: NotificationRouterFor<string>;
      var addedInterest: ObserverInterest;
      var changedInterest: ObserverInterest;
      var removedInterest: ObserverInterest;

      router = new NotificationRouterFor<string>(onCaucusChange.bind(this));
      addedInterest = new ObserverInterest(router, CaucusOf.caucusMemberAddedInterest);
      changedInterest = new ObserverInterest(router, CaucusOf.caucusMemberChangedInterest);
      removedInterest = new ObserverInterest(router, CaucusOf.caucusMemberRemovedInterest);
      props.shapeCaucus.addObserver(addedInterest);
      props.shapeCaucus.addObserver(changedInterest);
      props.shapeCaucus.addObserver(removedInterest);
   }

   return (<div className={cursorStylesFromMode(props.mode)}>
      <canvas
      className="App-canvas"
      ref={canvasRef as any}
      width={canvasWidth as any}
      height={canvasHeight as any}
      onClick={handleCanvasClick}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
   /></div>);
}
