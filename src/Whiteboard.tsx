/*! Copyright TXPCo 2022 */

// React
import React, { ChangeEvent, MouseEvent, useState } from 'react';

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
   DismissCircle24Regular,
   SignOut24Regular
} from '@fluentui/react-icons';

import { Alert } from '@fluentui/react-components/unstable';

// Local
import { IKeyValueStore, localKeyValueStore, KeyValueStoreKeys } from './KeyValueStore';
import { Persona } from './Persona';
import { FluidConnection } from './FluidConnection';
import { Interest, ObserverInterest, NotificationRouterFor, NotificationFor } from './NotificationFramework';
import { CaucusOf } from './Caucus';
import { Canvas } from './Canvas';
import { CanvasTools } from './CanvasTools';
import { CanvasMode } from './CanvasModes';

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

class NameKeyPair {

   public name: string;
   public key: string;

   constructor(name_: string, key_: string) {
      this.name = name_;
      this.key = key_;
   }

}

type NavigateToHash = (id: string) => void;

export interface IWhiteboardToolsHeaderProps {

   localUser: Persona;
   fluidConnection: FluidConnection;
   navigateToHash: NavigateToHash;
   participantCaucus: CaucusOf<Persona>;
}

export const WhiteboardToolsHeader = (props: IWhiteboardToolsHeaderProps) => {

   const headerClasses = headerStyles();
   const leftColumnClasses = leftColumnStyles();
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
      joinAs: props.localUser.name,
      enableShare: enableShareFromJoinAs(props.localUser.name),
      sharePrompt: sharePromptFromJoinAs(props.localUser.name),
      fluidId: null,
      alertMessage: null,
      connecting: false,
      canSignOut: false,
      mode: CanvasMode.Select
   });

   const urlToSharePromptDisabled: string = "You can copy the URL to share this whiteboard with others when you have clicked the share button";
   const urlToSharePromptEnabled: string = fullConnectionString(uiState.fluidId);

   const avatarNames = makeAvatarNames(uiState.joinAs, props.localUser, props.participantCaucus);
   const { inlineItems, overflowItems } = partitionAvatarGroupItems({ items: avatarNames, maxInlineItems: 3 });

   function makeAvatarNames(joinAs: string, localUser: Persona, caucus: CaucusOf<Persona>): Array<NameKeyPair> {

      var avatarNameKeyPair: Array<NameKeyPair> = new Array<NameKeyPair>();

      if (!caucus) {
         // If we have no members, for example we are not connected, we show ourselves only
         avatarNameKeyPair.push({ name: localUser.name, key: localUser.id });
      }
      else {
         let caucusMembers = caucus.current();

         caucusMembers.forEach((item, key) => {
            avatarNameKeyPair.push({ name: item.name, key: item.id });
         });
      }

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

   const setCanvasMode= (mode_: CanvasMode) => {
      setUiState((prevState) => {
         const data = {
            ...prevState,
            mode: mode_
         }
         return data
      })
   };

   function onJoinAsChange(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void {

      setState(data.value, uiState.fluidId, uiState.canSignOut);
   }

   function onConnect(): void {

      // Create a new, freshly stamped user, with the stable UUID and the text the user typed in 
      var newPersona: Persona = new Persona(props.localUser.id,
         uiState.joinAs,
         props.localUser.thumbnailB64,
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

            // Store the ID of the new whiteboard so we can return to it later
            var localStore: IKeyValueStore = localKeyValueStore();
            localStore.setItem(KeyValueStoreKeys.localWhiteboardUuid, id);

            // Navigate so the # is in the URL
            props.navigateToHash(id);
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
      if (id)
         return location.protocol + location.hostname + location.pathname + '#' + id;
      else
         return location.protocol + location.hostname + location.pathname;
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

   function onToolSelect(mode_: CanvasMode): void {
      setCanvasMode(mode_);
   }

   function onCaucusChange(interest_: Interest, id_: NotificationFor<string>): void {
      this.forceUpdate();
   }

   if (props.participantCaucus) {
      var router: NotificationRouterFor<string>;
      var addedInterest: ObserverInterest;
      var changedInterest: ObserverInterest;
      var removedInterest: ObserverInterest;

      router = new NotificationRouterFor<string>(onCaucusChange.bind(this));
      addedInterest = new ObserverInterest(router, CaucusOf.caucusMemberAddedInterest);
      changedInterest = new ObserverInterest(router, CaucusOf.caucusMemberChangedInterest);
      removedInterest = new ObserverInterest(router, CaucusOf.caucusMemberRemovedInterest);
      props.participantCaucus.addObserver(addedInterest);
      props.participantCaucus.addObserver(changedInterest);
      props.participantCaucus.addObserver(removedInterest);
   }

   return (
      <FluentProvider theme={teamsLightTheme}>
         <div className={headerClasses.root}>  {/* Top row for controls to setup a sharing session */}
            <div className={leftColumnClasses.root}>
               <Tooltip withArrow content={uiState.sharePrompt} relationship="label" key="share">
                  <Button icon={<Share24Regular />} disabled={(!uiState.enableShare) || uiState.connecting} onClick={onConnect} />
               </Tooltip>
               <Tooltip withArrow content={urlToShare()} relationship="label" key="copy">
                  <Button icon={<Copy24Regular />} disabled={uiState.fluidId===null} onClick={onCopyConnectionString} />
               </Tooltip>
               <Tooltip withArrow content={"Sign out."} relationship="label" key="signout">
                  <Button icon={<SignOut24Regular />} disabled={!(uiState.canSignOut)} onClick={onSignOut} />
               </Tooltip>
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

         <CanvasTools onToolSelect={onToolSelect} ></CanvasTools>

         <div className={alertClasses.root}>
            {uiState.alertMessage
               ? <Alert action={{
                  icon: <DismissCircle24Regular onClick={hideAlert} />
               }}>{uiState.alertMessage}</Alert>
            : <div></div>}
         </div>

         <Canvas mode={uiState.mode}></Canvas>

      </FluentProvider>
   );
}
