/*! Copyright TXPCo 2022 */

// React
import React, { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { createRoot } from "react-dom/client";

// Fluent
import {
   FluentProvider, teamsLightTheme, makeStyles, Button, Tooltip,
   AvatarGroup, AvatarGroupPopover, AvatarGroupItem, partitionAvatarGroupItems,
   useId, Input, 
   InputOnChangeData
} from '@fluentui/react-components';

import {
   Share24Regular,
   Copy24Regular,
   Person24Regular,
   DrawText24Regular,
   Square24Regular,
   Circle24Regular,
   Line24Regular,
   DismissCircle24Regular,
   SignOut24Regular
} from '@fluentui/react-icons';

import { Toolbar, ToolbarButton, Alert } from '@fluentui/react-components/unstable';

import { log, LogLevel, tag } from 'missionlog';

// Local
import { uuid } from './Uuid';
import { IKeyValueStore, localKeyValueStore, KeyValueStoreKeys } from './KeyValueStore';
import { Interest, ObserverInterest, NotificationRouterFor, NotificationFor } from './NotificationFramework';
import { Persona } from './Persona';
import { Participants } from './Participants';
import { FluidConnection } from './FluidConnection';

// Logging handler
const logger = {
   [LogLevel.ERROR]: (tag, msg, params) => console.error(msg, ...params),
   [LogLevel.WARN]: (tag, msg, params) => console.warn(msg, ...params),
   [LogLevel.INFO]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.TRACE]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.DEBUG]: (tag, msg, params) => console.log(msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

const headerStyles = makeStyles({
   root: {
      display: 'flex'
   },
});

const leftColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'left',
      marginLeft: '0',
      marginRight: 'auto',
      alignItems: 'center'
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

const rightColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'right',
      marginLeft: 'auto',
      marginRight: '0',
      alignItems: 'center'
   },
});

const linkStyles = makeStyles({
   root: {
      wordBreak: 'break-all',
      whiteSpace: 'normal'
   },
});

const alertStyles = makeStyles({
   root: {
      display: 'flex'
   },
});

export interface IAppProps {

}

class AppState {
   participants: Participants;
   fluidConnection: FluidConnection;
}

function makeLocalUser(): Persona {

   var localStore: IKeyValueStore = localKeyValueStore();

   // Look up the UUID if it isstore, else create a new one and save it
   var localUserUuid: string = localStore.getItem(KeyValueStoreKeys.localUserUuid);
   if (!localUserUuid) {
      localUserUuid = uuid();
      localStore.setItem(KeyValueStoreKeys.localUserUuid, localUserUuid)
   }

   // Create 'unknown' users, but with stable UUID'
   var unknown: Persona = Persona.unknown();
   log.debug(tag.application, "Local User UUID:" + localUserUuid);

   return new Persona(localUserUuid, unknown.name, unknown.thumbnailB64, unknown.lastSeenAt);

}

export class App extends React.Component<IAppProps, AppState> {

   private _initialUser: Persona;
   private _router: NotificationRouterFor<Array<Persona>>;
   private _interest: ObserverInterest;

   constructor(props: IAppProps) {

      super(props);

      // Initialise logging
      log.init({ application: 'DEBUG', notification: 'DEBUG' }, (level, tag, msg, params) => {
         logger[level as keyof typeof logger](tag, msg, params);
      });

      this._initialUser = makeLocalUser();
      this._router = new NotificationRouterFor<Array<Persona>>(this.onRemoteChange.bind(this));
      this._interest = new ObserverInterest(this._router, FluidConnection.remoteUsersChangedInterest);

      var fluidConnection: FluidConnection = new FluidConnection({});
      var participants: Participants = new Participants(this._initialUser, new Array<Persona>())
      fluidConnection.addObserver(this._interest);

      this.state = {
         fluidConnection: fluidConnection,
         participants: participants
      };

   }

   onRemoteChange(interest_: Interest, notification_: NotificationFor<Array<Persona>>): void {

      this.setState({ participants: new Participants(this._initialUser, notification_.eventData) });
      this.forceUpdate(); // Need to push new properties down to the Header component
   }

   render() {
      return (
         <WhiteboardToolsHeader fluidConnection={this.state.fluidConnection} participants={this.state.participants} />
      );
   }
}

class NameKeyPair {

   public name: string;
   public key: string;

   constructor(name_: string, key_: string) {
      this.name = name_;
      this.key = key_;
   }

}

export interface IWhiteboardToolsHeaderProps {

   participants: Participants;
   fluidConnection: FluidConnection;
}

export const WhiteboardToolsHeader = (props: IWhiteboardToolsHeaderProps) => {
   const headerClasses = headerStyles();
   const leftColumnClasses = leftColumnStyles();
   const midColumnClasses = midColumnStyles();
   const rightColumnClasses = rightColumnStyles();
   const linkClasses = linkStyles();
   const alertClasses = alertStyles();

   const inputId = useId('joinAs');

   function isJoiningExisting(): boolean {
      return location.hash ? true : false;
   }

   function existingWhiteboardId(): string {
      if (isJoiningExisting()) {
         return location.hash.substring(1);
      }

      return null;
   }

   // Control UI for share enable/disable
   const sharePromptDisabled: string = isJoiningExisting() ? "Join existing Whiteboard. Enter your name or initials on the right to enable this button." : "Share Whiteboard. Enter your name or initials on the right to enable this button.";
   const sharePromptEnabled: string = isJoiningExisting() ? "Join existing Whiteboard." : "Share Whiteboard.";
   const joinAsPrompt: string = isJoiningExisting() ? "Enter your name or initials to join this Whiteboard." : "Enter your name or initials to share this Whiteboard.";

   function enableShareFromJoinAs(joinAs: string): boolean {
      if (joinAs && joinAs.length >= 2) {
         return true;
      } else {
         return false;
      }
   }

   function sharePromptFromJoinAs(joinAs: string): string {
      if (joinAs && joinAs.length >= 2) {
         return sharePromptEnabled;
      } else {
         return sharePromptDisabled;
      }
   }

   const [uiState, setUiState] = useState({
      joinAs: props.participants.localUser.name,
      enableShare: enableShareFromJoinAs(props.participants.localUser.name),
      sharePrompt: sharePromptFromJoinAs(props.participants.localUser.name),
      fluidId: null,
      alertMessage: null,
      connecting: false,
      canSignOut: false
   });

   const urlToSharePromptDisabled: string = "You can copy the URL to share this whiteboard with others when you have clicked the share button";
   const urlToSharePromptEnabled: string = fullConnectionString(uiState.fluidId);

   const avatarNames = makeAvatarNames(uiState.joinAs, props.participants.localUser, props.participants.remoteUsers);
   const { inlineItems, overflowItems } = partitionAvatarGroupItems({ items: avatarNames, maxInlineItems: 3 });

   function makeAvatarNames(joinAs: string, localUser: Persona, remoteUsers: Persona[]): Array<NameKeyPair> {
      var avatarNameKeyPair: Array<NameKeyPair> = new Array<NameKeyPair>();

      avatarNameKeyPair.push({ name: joinAs, key: localUser.id });

      remoteUsers.forEach((item, index) => {
         avatarNameKeyPair.push({ name: item.name, key: item.id });
      });

      return avatarNameKeyPair;
   }

   const setState = (newJoinAs: string, newFluidId: string, canSignOut: boolean) => {
      setUiState((prevState) => {
         const data = {
            ...prevState,
            joinAs: newJoinAs,
            enableShare: (newFluidId === null) && (enableShareFromJoinAs(newJoinAs)),
            sharePrompt: sharePromptFromJoinAs(newJoinAs),
            fluidId: newFluidId,
            canSignOut: canSignOut
         }
         return data
      })
   };

   function onJoinAsChange(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void {

      setState(data.value, uiState.fluidId, uiState.canSignOut);
   }

   function onConnect(): void {

      // Create a new, freshly stamped user, with the stable UUID and the text the user typed in 
      var newPersona: Persona = new Persona(props.participants.localUser.id,
         uiState.joinAs,
         props.participants.localUser.thumbnailB64,
         new Date());

      if (isJoiningExisting()) {
         attachToExistingConnection(existingWhiteboardId(), newPersona);
      }
      else {
         createNewConnection(newPersona);
      }
   }

   function createNewConnection (localUser: Persona): void {
      var id: string;

      onConnectionStarting();

      props.fluidConnection.createNew(localUser)
         .then((id: string) => {
            setState(uiState.joinAs, id, onConnectionEnding());
         })
         .catch((e: Error) => {
            onConnectionEnding();
            var alert: string;

            if (e.message)
               alert = "Sorry, we encountered an error connecting to the data service. The error was \'" + e.message + "\'.";
            else
               alert = "Sorry, we encountered an error connecting to the data service.";

            showAlert(alert);
         });
   }

   function attachToExistingConnection(id: string, localUser: Persona): void {
      var id: string;

      onConnectionStarting();

      props.fluidConnection.attachToExisting(id, localUser)
         .then((id: string) => {
            setState(uiState.joinAs, id, onConnectionEnding());
         })
         .catch((e: Error) => {
            onConnectionEnding();
            var alert: string;

            if (e.message)
               alert = "Sorry, we encountered an error connecting to the data service. The error was \'" + e.message + "\'.";
            else
               alert = "Sorry, we encountered an error connecting to the data service.";

            showAlert(alert);
         });
   }

   function fullConnectionString(id: string): string {
      return window.location.href + '#' + id;
   }

   function onCopyConnectionString(): void {
      navigator.clipboard.writeText(fullConnectionString(uiState.fluidId));
   }

   function onSignOut(): void {
      try {

         props.fluidConnection.disconnect().then(() => {
            setState(uiState.joinAs, null, false);
         });
         

      } catch (e: any) {

         var alert: string;

         if (e.message)
            alert = "Sorry, we encountered an error with the remote data service. The error was \'" + e.message + "\'.";
         else
            alert = "Sorry, we encountered an error with the remote data service.";

         showAlert(alert);
      }
   }

   function urlToShare() {
      return (uiState.fluidId === null
         ? (<p className={linkClasses.root}>{urlToSharePromptDisabled}</p>)
         : (<div><b>Link for others to use this Whiteboard:</b><p className={linkClasses.root}>{urlToSharePromptEnabled}</p></div>));
   }

   function showAlert(alert: string): void {
      uiState.alertMessage = alert;
      setState(uiState.joinAs, uiState.fluidId, uiState.canSignOut);
   }

   function hideAlert(ev: MouseEvent): void {
      uiState.alertMessage = null;
      setState(uiState.joinAs, uiState.fluidId, uiState.canSignOut);
   }

   function onConnectionStarting (): void {
      uiState.connecting = true;
      uiState.canSignOut = false;
   }

   function onConnectionEnding(): boolean {
      uiState.connecting = false;
      uiState.canSignOut = props.fluidConnection.canDisconnect();

      return uiState.canSignOut;
   }

   return (
      <FluentProvider theme={teamsLightTheme}>
         <div className={headerClasses.root}>
            <div className={leftColumnClasses.root}>
               <Tooltip withArrow content={uiState.sharePrompt} relationship="label">
                  <Button icon={<Share24Regular />} disabled={(!uiState.enableShare) || uiState.connecting} onClick={onConnect} />
               </Tooltip>
               <Tooltip withArrow content={urlToShare()} relationship="label">
                  <Button icon={<Copy24Regular />} disabled={uiState.fluidId===null} onClick={onCopyConnectionString} />
               </Tooltip>
               <Tooltip withArrow content={"Sign out."} relationship="label">
                  <Button icon={<SignOut24Regular />} disabled={!(uiState.canSignOut)} onClick={onSignOut} />
               </Tooltip>
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
               <Tooltip withArrow content={joinAsPrompt} relationship="label">
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
                  {inlineItems.map(nameKeyPair => (
                     <Tooltip withArrow content={nameKeyPair.name} relationship="label" key={nameKeyPair.key}>
                        <AvatarGroupItem name={nameKeyPair.name} key={nameKeyPair.key} />
                     </Tooltip>
                  ))}
                  {overflowItems && (
                     <AvatarGroupPopover>
                        {overflowItems.map(nameKeyPair => (
                           <AvatarGroupItem name={nameKeyPair.name} key={nameKeyPair.key} />
                        ))}
                     </AvatarGroupPopover>
                  )}
               </AvatarGroup>
            </div>
         </div>
         <div className={alertClasses.root}>
            {uiState.alertMessage
               ? <Alert action={{
                  icon: <DismissCircle24Regular onClick={hideAlert} />
               }}>{uiState.alertMessage}</Alert>
            : <div></div>}
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