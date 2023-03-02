/*! Copyright TXPCo 2022 */

// React
import React from 'react';

// Fluent
import { makeStyles, Tooltip } from '@fluentui/react-components';

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

import { Toolbar, ToolbarButton, ToolbarRadioButton, ToolbarDivider, ToolbarProps } from '@fluentui/react-components/unstable';

// Local 
import { Shape } from './Shape';
import { CaucusOf } from './Caucus';
import { ECanvasMode } from './CanvasModes';

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

type OnToolSelect = (tool: ECanvasMode) => void;

export interface ICanvasToolsProps {

   onToolSelect: OnToolSelect;
   shapeCaucus: CaucusOf<Shape>;
}

export const CanvasTools = (props: ICanvasToolsProps) => {
   const headerClasses = headerStyles();
   const midColumnClasses = midColumnStyles();

   const handleToolSelect = (mode: ECanvasMode): void => {
      props.onToolSelect(mode);
   };

   function enableTools(shapeCaucus_: CaucusOf<Shape>): boolean {
      if (shapeCaucus_)
         return true;
      else
         return false;
   };

   const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>> ({
      mode: ["Select"],
   });
   const onChange: ToolbarProps["onCheckedValueChange"] = (
      e,
      { name, checkedItems }
   ) => {
      setCheckedValues((s) => {
         return {
               [name]: checkedItems,
            };
      });
   };

   return (
         <div className={headerClasses.root}> {/* Row for Whiteboard controls */}
            <div className={midColumnClasses.root}>
               <Toolbar checkedValues={checkedValues} onCheckedValueChange={onChange}>
                  <Tooltip withArrow content="Select." relationship="label" key="1">
                    <ToolbarRadioButton aria-label="Select" name="mode" value="Select" icon={<Cursor24Regular />}
                     onClick={() => { handleToolSelect(ECanvasMode.Select) }}
                     disabled={!enableTools(props.shapeCaucus)}
                     />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a box." relationship="label" key="3">
                  <ToolbarRadioButton aria-label="Box" name="mode" value="Rectangle" icon={<Square24Regular />}
                     onClick={() => { handleToolSelect(ECanvasMode.Rectangle) }} 
                     disabled={!enableTools(props.shapeCaucus)} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a line." relationship="label" key="4">
                  <ToolbarRadioButton aria-label="Line" name="mode" value="Line" icon={<Line24Regular />}
                     onClick={() => { handleToolSelect(ECanvasMode.Line) }}
                     disabled={!enableTools(props.shapeCaucus)} />
                  </Tooltip>
                  <Tooltip withArrow content="Write text." relationship="label" key="6">
                  <ToolbarRadioButton aria-label="Text" name="mode" value="Text" icon={<DrawText24Regular />}
                     onClick={() => { handleToolSelect(ECanvasMode.Text) }} 
                     disabled={!enableTools(props.shapeCaucus)} />
                  </Tooltip>
                  <Tooltip withArrow content="Rub things out." relationship="label" key="7">
                     <ToolbarRadioButton aria-label="Rub things out" name="mode" value="Eraser" icon={<Eraser24Regular />}
                     disabled={!enableTools(props.shapeCaucus)} />
                  </Tooltip>
                  <ToolbarDivider />
                  <Tooltip withArrow content="Choose a pen." relationship="label" key="8">
                     <ToolbarButton aria-label="Choose a pen" icon={<Pen24Regular />}
                        disabled={!enableTools(props.shapeCaucus)} />
                  </Tooltip>
               </Toolbar>
         </div>
      </div>
   );
}
