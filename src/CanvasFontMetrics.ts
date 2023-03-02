// Copyright (c) 2023 TXPCo Ltd

// Ref
// https://blog.steveasleep.com/how-to-draw-multi-line-text-on-an-html-canvas-in-2021

function findLeafNodeStyle(ancestor: Element): CSSStyleDeclaration {
   let nextAncestor = ancestor;
   while (nextAncestor.children.length) {
      nextAncestor = nextAncestor.children[0];
   }
   return window.getComputedStyle(nextAncestor, null);
}

export class FontMetrics {
   font: string;
   lineHeight: number;
}

export function fontMetrics (element: HTMLElement) : FontMetrics {

   const style = findLeafNodeStyle(element);

   var lineHeight = parseFloat(style.getPropertyValue("line-height"));

   /*
   var font = style.getPropertyValue("font");

   var fontStyle = style.getPropertyValue("font-style");
   var fontVariant = style.getPropertyValue("font-variant");
   var fontWeight = style.getPropertyValue("font-weight");
   */

   var fontFamily = (style.getPropertyValue("font-family")).split(",", 1)[0].replaceAll('"', '');;
   var fontSize = parseFloat(style.getPropertyValue("font-size"));

   return ({
      font: fontSize + 'px ' + fontFamily,
      lineHeight: lineHeight
   });
}