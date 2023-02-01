/*! Copyright TXPCo 2022 */

// React
import React from 'react';

// Fluent
import {
   makeStyles, Tooltip,

} from '@fluentui/react-components';

import {
   Cursor24Regular,
   DataLine24Regular,
   Eraser24Regular,
   DrawText24Regular,
   Square24Regular,
   Circle24Regular,
   Line24Regular,
   Pen24Regular
} from '@fluentui/react-icons';

import { Toolbar, ToolbarButton, Alert } from '@fluentui/react-components/unstable';

const headerStyles = makeStyles({
   root: {
      display: 'flex'
   },
});

const midColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      alignItems: 'center'
   },
});

export interface ICanvasToolsProps {

}

export const CanvasTools = (props: ICanvasToolsProps) => {
   const headerClasses = headerStyles();
   const midColumnClasses = midColumnStyles();

   return (
         <div className={headerClasses.root}> {/* Row for Whiteboard controls */}
            <div className={midColumnClasses.root}>
               <Toolbar>
                  <Tooltip withArrow content="Select." relationship="label" key="1">
                     <ToolbarButton aria-label="Select" icon={<Cursor24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a freehand line." relationship="label" key="2">
                     <ToolbarButton aria-label="Draw a freehand line" icon={<DataLine24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a box." relationship="label" key="3">
                     <ToolbarButton aria-label="Box" icon={<Square24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a straight line or an arrow." relationship="label" key="4">
                     <ToolbarButton aria-label="Box" icon={<Line24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a circle or an ellipse." relationship="label" key="5">
                     <ToolbarButton aria-label="Ellipse" icon={<Circle24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Write text." relationship="label" key="6">
                     <ToolbarButton aria-label="Text" icon={<DrawText24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Choose a pen." relationship="label" key="7">
                     <ToolbarButton aria-label="Choose a pen" icon={<Pen24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Rub things out." relationship="label" key="8">
                     <ToolbarButton aria-label="Rub things out" icon={<Eraser24Regular />} />
                  </Tooltip>
               </Toolbar>
         </div>
      </div>
   );
}
