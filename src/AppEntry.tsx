/*! Copyright TXPCo 2022 */

// React
import React, { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";

import {
   FluentProvider, teamsLightTheme, makeStyles, Button, Tooltip,
   AvatarGroup, AvatarGroupPopover, AvatarGroupItem, partitionAvatarGroupItems,
   useId, Input, Popover, PopoverTrigger, PopoverSurface,
   InputOnChangeData
} from '@fluentui/react-components';

import { Toolbar, ToolbarButton } from '@fluentui/react-components/unstable';
import { Share24Regular, Info24Regular, Person24Regular, DrawText24Regular, Square24Regular, Circle24Regular, Line24Regular } from '@fluentui/react-icons';

import { Persona } from './Persona';
//import { FluidConnection } from './FluidConnection';
import { uuid } from './Uuid';

export interface IConnectionProps {
}

export class FluidConnection {

   constructor(props: IConnectionProps) {
   }

   async createNew(localUser: Persona): Promise<string> {
      return "1234";
   }
}
export interface IAppProps {

}

class AppState {
   localUser: Persona;
   fluidConnection: FluidConnection;
}

const headerStyles = makeStyles({
   root: {
      display: 'flex'
   },
});

const leftColumnStyles = makeStyles({
   root: {
      flexDirection: 'column',
      alignSelf: 'left',
      marginLeft: '0',
      marginRight: 'auto'
   },
});

const midColumnStyles = makeStyles({
   root: {
      flexDirection: 'column',
      alignSelf: 'center',
      marginLeft: 'auto',
      marginRight: 'auto'
   },
});

const rightColumnStyles = makeStyles({
   root: {
      flexDirection: 'column',
      alignSelf: 'right',
      marginLeft: 'auto',
      marginRight: '0'
   },
});

export class App extends React.Component<IAppProps, AppState> {

   constructor(props: IAppProps) {

      super(props);

      this.state = { fluidConnection: new FluidConnection({}), localUser: Persona.unknown()};
   }


   render() {
      return (
         <WhiteboardToolsHeader fluidConnection={this.state.fluidConnection} initialUser={this.state.localUser}  />
      );
   }
}

export interface IWhiteboardToolsHeaderProps {

   fluidConnection: FluidConnection;
   initialUser: Persona;
   // onConnect(name: string): void;
}

export const WhiteboardToolsHeader = (props: IWhiteboardToolsHeaderProps) => {
   const headerClasses = headerStyles();
   const leftColumnClasses = leftColumnStyles();
   const midColumnClasses = midColumnStyles();
   const rightColumnClasses = rightColumnStyles();
   const names = ['Jon Verrier', 'Someone Else'];
   const {inlineItems,  overflowItems} = partitionAvatarGroupItems({items: names});
   const inputId = useId('joinAs');

   // Control UI for share enable/disable
   const sharePromptDisabled: string = "Share Whiteboard. Enter your name or initials on the right to enable this button.";
   const sharePromptEnabled: string = "Share Whiteboard.";
   const urlToSharePromptDisabled: string = "The link for you to share with others so they can access this Whiteboard will appear here when you click the share button";
   const urlToSharePromptEnabled: string = "Share the link below with others for them to access this Whiteboard.";

   function enableShareFromJoinAs(joinAs: string): boolean {
      if (joinAs.length >= 2) {
         return true;
      } else {
         return false;
      }
   }
   function sharePromptFromJoinAs(joinAs: string): string {
      if (joinAs.length >= 2) {
         return sharePromptEnabled;
      } else {
         return sharePromptDisabled;
      }
   }

   const [uiState, setUiState] = useState({
      joinAs: props.initialUser.name,
      enableShare: enableShareFromJoinAs(props.initialUser.name),
      sharePrompt: sharePromptFromJoinAs(props.initialUser.name),
      fluidId: null
   });

   const uiStateSet = (newJoinAs: string, newFluidId: string) => {
      setUiState((prevState) => {
         const data = {
            ...prevState,
            joinAs: newJoinAs,
            enableShare: (newFluidId === null) && (enableShareFromJoinAs(newJoinAs)),
            sharePrompt: sharePromptFromJoinAs(newJoinAs),
            fluidId: newFluidId
         }
         return data
      })
   };


   function onJoinAsChange(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void {

      uiStateSet(data.value, uiState.fluidId);
   }

   function onShareConnection(): void {
      var newPersona: Persona = new Persona(uuid(), uiState.joinAs, Persona.unknownImage(), new Date());

      uiStateSet(uiState.joinAs, "TestID");
   }

   function urlToShare() {
      return (uiState.fluidId === null
         ? (<p>{urlToSharePromptDisabled}</p>)
         : (<div><p>{urlToSharePromptEnabled}</p><p>{uiState.fluidId}</p></div>));
   }

   return (
      <FluentProvider theme={teamsLightTheme}>
         <div className={headerClasses.root}>
            <div className={leftColumnClasses.root}>
               <Tooltip withArrow content={uiState.sharePrompt} relationship="label">
                  <Button icon={<Share24Regular />} disabled={!uiState.enableShare} onClick={onShareConnection} />
               </Tooltip>
               <Popover>
                  <PopoverTrigger>
                     <Tooltip withArrow content={urlToShare()} relationship="label">
                        <Button icon={<Info24Regular />} disabled={!uiState.enableShare}/>
                     </Tooltip>
                  </PopoverTrigger>
                  <PopoverSurface aria-label="URL for this whiteboard to share with others.">
                     <div>{urlToShare()}</div>
                  </PopoverSurface>
               </Popover>
            </div>
            <div className={midColumnClasses.root}>
               <Toolbar>
                  <Tooltip withArrow content="Draw a box." relationship="label" key="1">
                     <ToolbarButton aria-label="Box" icon={<Square24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a line or an arrow." relationship="label" key="2">
                     <ToolbarButton aria-label="Box" icon={<Line24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Draw a circle or an ellipse." relationship="label" key="3">
                     <ToolbarButton aria-label="Ellipse" icon={<Circle24Regular />} />
                  </Tooltip>
                  <Tooltip withArrow content="Write text." relationship="label" key="4">
                     <ToolbarButton aria-label="Text" icon={<DrawText24Regular />} />
                  </Tooltip>
               </Toolbar>
            </div>
            <div className={rightColumnClasses.root}>
               <Tooltip withArrow content={"Enter your name or initials to share this Whiteboard."} relationship="label">
                  <Input id={inputId} aria-label="Join As (Name/Initials)"
                     value={uiState.joinAs}
                     contentBefore={<Person24Regular />}
                     placeholder="Join As..."
                     onChange={onJoinAsChange}
                     disabled={!(uiState.fluidId===null)}
                  />
               </Tooltip>
               &nbsp;
               <AvatarGroup size={24}>
                  {inlineItems.map(name => (
                     <Tooltip withArrow content={name} relationship="label" key={name}>
                        <AvatarGroupItem name={name} key={name} />
                     </Tooltip>
                  ))}
                  {overflowItems && (
                     <AvatarGroupPopover>
                        {overflowItems.map(name => (
                           <AvatarGroupItem name={name} key={name} />
                        ))}
                     </AvatarGroupPopover>
                  )}
               </AvatarGroup>
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