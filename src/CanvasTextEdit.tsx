/*! Copyright TXPCo 2022 */

// React
import React from 'react';

// Fluent
import { makeStyles, tokens, Tooltip, Textarea, TextareaProps } from '@fluentui/react-components';

import {
   CheckmarkSquare24Regular,
   DismissSquare24Regular
} from '@fluentui/react-icons';

import { Toolbar, ToolbarButton } from '@fluentui/react-components/unstable';

// Local 
import { GRect } from './GeometryRectangle';
import { EUIActions } from './CanvasModes';

const canvasTextAreaId = "canvasTextArea";

const outerStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute'
   },
});

const buttonBlockStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'right',
      marginLeft: 'auto',
      marginRight: '0',
      marginTop: '0',
      marginBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
      alignItems: 'center'
   },
});

const textColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      "& > label": {
         display: "block",
         marginBottom: tokens.spacingVerticalMNudge,
      },
      marginLeft: '0',
      marginRight: '0',
      marginTop: '0',
      marginBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
      width: '100%',
      verticalAlign: 'middle'
   },
   textarea: {
      height: '100%',
      marginLeft: '0',
      marginRight: '0',
      marginTop: '0',
      marginBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0'
   },
});

type OnToolSelect = (tool: EUIActions, text: string) => void;

export interface ICanvasTextEditProps {

   onToolSelect: OnToolSelect;
   boundary: GRect;
   initialText: string;
}

export const CanvasTextEdit = (props: ICanvasTextEditProps) => {

   var closed = false;

   const headerClasses = outerStyles();
   const rightColumnClasses = buttonBlockStyles();
   const textColumnClasses = textColumnStyles();

   const handleToolSelect = (action: EUIActions): void => {
      props.onToolSelect(action, value);
      closed = true;
   };

   function enableOk(text: string): boolean {
      if (text && text.length > 0)
         return true;
      else
         return false;
   };

   const [value, setValue] = React.useState(props.initialText);

   const onChange: TextareaProps["onChange"] = (ev: React.ChangeEvent<HTMLTextAreaElement>, data): void => {
      if (data.value.length <= 1024) {
         setValue(data.value);
      }
   };

   const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {

      const currentTarget = event.currentTarget;

      // Check the newly focused element in the next tick of the event loop
      setTimeout(() => {
         // Check if the new activeElement is a child of the original container
         if (!currentTarget.contains(document.activeElement) && (!closed)) {
            externalBlur(event);
         }
      }, 0);
   };

   const externalBlur = (event: React.FocusEvent<HTMLDivElement>): void => {

      props.onToolSelect(EUIActions.Ok, value);
   };

   // Move focus to text area in the next tick of the event loop
   setTimeout(() => {
      let textAreaDiv = document.getElementById(canvasTextAreaId);
      if (textAreaDiv) {
         let opts = { preventScroll: true, focusVisible: false };
         textAreaDiv.focus(opts);
      }
   }, 0);

   return (
      <div className={headerClasses.root}
         style={{
            top: (props.boundary.y).toString() + 'px',
            left: (props.boundary.x).toString() + 'px',
            width: props.boundary.dx.toString() + 'px',
            height: props.boundary.dy.toString() + 'px'
         }}
         onBlur={handleBlur}
      >  

         <div className={rightColumnClasses.root} >
            <Toolbar size="small">
               <Tooltip withArrow content="Ok" relationship="label" key="1">
                  <ToolbarButton aria-label="Ok" icon={<CheckmarkSquare24Regular />}
                     onClick={() => { handleToolSelect(EUIActions.Ok) }}
                     disabled={!enableOk(value)} />
               </Tooltip>
               <Tooltip withArrow content="Cancel" relationship="label" key="2">
                  <ToolbarButton aria-label="Cancel" icon={<DismissSquare24Regular />}
                     onClick={() => { handleToolSelect(EUIActions.Cancel) }}
                     disabled={false} />
               </Tooltip>
            </Toolbar>
         </div>
         <div className={textColumnClasses.root}>
            <Textarea
               id={canvasTextAreaId}
               appearance="outline"
               placeholder="Type here..."
               textarea={{ className: textColumnClasses.textarea }}
               resize="none"
               value={value}
               onChange={onChange}
               style={{
                  height: (props.boundary.dy + 40).toString() + 'px'
               }}               
            />
         </div>
      </div>
   );
}
