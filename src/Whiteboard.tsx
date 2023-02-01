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
import { Participants } from './Participants';
import { FluidConnection } from './FluidConnection';
import { Canvas } from './Canvas';
import { CanvasTools } from './CanvasTools';

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

   participants: Participants;
   fluidConnection: FluidConnection;
   navigateToHash: NavigateToHash;
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

         <CanvasTools ></CanvasTools>

         <div className={alertClasses.root}>
            {uiState.alertMessage
               ? <Alert action={{
                  icon: <DismissCircle24Regular onClick={hideAlert} />
               }}>{uiState.alertMessage}</Alert>
            : <div></div>}
         </div>

         <Canvas ></Canvas>

      </FluentProvider>
   );
}
