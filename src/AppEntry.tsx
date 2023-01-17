/*! Copyright TXPCo 2022 */

// React
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";

import { FluentProvider, teamsLightTheme, makeStyles, Button, Tooltip, Avatar } from '@fluentui/react-components';
import { Toolbar, ToolbarButton } from '@fluentui/react-components/unstable';
import { Home24Regular, DrawText24Regular, Square24Regular, Circle24Regular, Line24Regular } from '@fluentui/react-icons';

// FluidClient
import { FluidClient } from './FluidClient';

export interface IAppProps {

}

class AppState {
   fluidClient: FluidClient;
}

const headerStyles = makeStyles({
   root: {
      display: 'flex' //,
      //justifyContent: 'spaceBetween'
   },
});

const leftColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'left',
      marginLeft: '0',
      marginRight: 'auto'
   },
});

const midColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      marginLeft: 'auto',
      marginRight: 'auto'
   },
});

const rightColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'right',
      marginLeft: 'auto',
      marginRight: '0'
   },
});

export class App extends React.Component<IAppProps, AppState> {

   constructor(props: IAppProps) {

      super(props);

      this.state = { fluidClient: new FluidClient() };
   }


   render() {
      return (
         <Whiteboard />
      );
   }
}


export const Whiteboard = () => {
   const headerClasses = headerStyles();
   const leftColumnClasses = leftColumnStyles();
   const midColumnClasses = midColumnStyles();
   const rightColumnClasses = rightColumnStyles();

   return (
      <FluentProvider theme={teamsLightTheme}>
         <div className={headerClasses.root}>
            <div className={leftColumnClasses.root}>
               <Tooltip withArrow content="Navigate to Home" relationship="label">
                  <Button icon={<Home24Regular />} />
               </Tooltip>
            </div>
            <div className={midColumnClasses.root}>
               <Toolbar>
                  <Tooltip withArrow content="Draw a box" relationship="label">
                     <ToolbarButton aria-label="Box" icon={<Square24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a line or arrow" relationship="label">
                     <ToolbarButton aria-label="Box" icon={<Line24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a circle or ellipse" relationship="label">
                     <ToolbarButton aria-label="Ellipse" icon={<Circle24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a text" relationship="label">
                     <ToolbarButton aria-label="Text" icon={<DrawText24Regular />} />
                  </Tooltip>
               </Toolbar>
            </div>
            <div className={rightColumnClasses.root}>
               <Tooltip withArrow content="Jon Verrier" relationship="label">
                  <Avatar
                     name="Jon Verrier"
                     shape="square"
                     />
               </Tooltip>
            </div>
         </div>
      </FluentProvider>
   );
}
// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   const root = createRoot(document.getElementById("reactRoot") as HTMLElement);
   root.render(
      <App />
   ); 
}

