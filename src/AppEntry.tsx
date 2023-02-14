/*! Copyright TXPCo 2022 */

// React
import React from 'react';
import { createRoot } from "react-dom/client";

// Other 3rd party imports
import { log, LogLevel, tag } from 'missionlog';

// Local
import { uuid } from './Uuid';
import { IKeyValueStore, localKeyValueStore, KeyValueStoreKeys } from './KeyValueStore';
import { ObserverInterest, NotificationRouterFor } from './NotificationFramework';
import { CaucusOf } from './Caucus';
import { Persona } from './Persona';
import { Shape } from './Shape';
import { FluidConnection } from './FluidConnection';
import { WhiteboardToolsHeader } from './Whiteboard';

// Logging handler
const logger = {
   [LogLevel.ERROR]: (tag, msg, params) => console.error(msg, ...params),
   [LogLevel.WARN]: (tag, msg, params) => console.warn(msg, ...params),
   [LogLevel.INFO]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.TRACE]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.DEBUG]: (tag, msg, params) => console.log(msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;


export interface IAppProps {

}

class AppState {

   localUser: Persona;
   fluidConnection: FluidConnection;
   participantCaucus: CaucusOf<Persona>;
   shapeCaucus: CaucusOf<Shape>;
}

function makeLocalUser(): Persona {

   var localStore: IKeyValueStore = localKeyValueStore();

   // Look up the UUID if it is stored, else create a new one and save it
   var localUserUuid: string = localStore.getItem(KeyValueStoreKeys.localUserUuid);
   if (!localUserUuid) {
      localUserUuid = uuid();
      localStore.setItem(KeyValueStoreKeys.localUserUuid, localUserUuid)
   }

   // Create 'unknown' users, but with stable UUID
   var unknown: Persona = Persona.unknown();
   log.debug(tag.application, "Local User UUID:" + localUserUuid);

   return new Persona(localUserUuid, unknown.name, unknown.thumbnailB64, unknown.lastSeenAt);
}

function navigateToHash(id: string): void {

   if (id) {
      log.debug(tag.application, "Navigating to:" + id);
      window.location.hash = '#' + id;
   }
}

function checkNavigateToLastBoard(): void {

   if (location.protocol === 'file:') //  Don't attempt to rejoin local Whiteboard as they are ephemeral
      return;

   var localStore: IKeyValueStore = localKeyValueStore();

   // Look up the UUID for last Whiteboard if it is stored
   var localWhiteboardUuid: string = localStore.getItem(KeyValueStoreKeys.localWhiteboardUuid);
   if (localWhiteboardUuid) {
      navigateToHash(localWhiteboardUuid);
   }
}

export class App extends React.Component<IAppProps, AppState> {

   private _initialUser: Persona;
   private _router: NotificationRouterFor<string>;
   private _connectedInterest: ObserverInterest;

   constructor(props: IAppProps) {

      super(props);

      // Initialise logging
      log.init({ application: 'DEBUG', notification: 'DEBUG' }, (level, tag, msg, params) => {
         logger[level as keyof typeof logger](tag, msg, params);
      });

      checkNavigateToLastBoard();

      this._initialUser = makeLocalUser();

      var fluidConnection: FluidConnection = new FluidConnection({});
      this._router = new NotificationRouterFor<string>(this.onConnection.bind(this));
      this._connectedInterest = new ObserverInterest(this._router, FluidConnection.connectedInterest);
      fluidConnection.addObserver(this._connectedInterest);

      this.state = {
         fluidConnection: fluidConnection,
         localUser: this._initialUser,
         participantCaucus: null,
         shapeCaucus: null
      };

   }

   onConnection(containerId: string): void {

      this.setState ({
         fluidConnection: this.state.fluidConnection,
         localUser: this.state.localUser,
         participantCaucus: this.state.fluidConnection.participantCaucus(),
         shapeCaucus: this.state.fluidConnection.shapeCaucus()
      });
   }

   render() {
      return (
         <WhiteboardToolsHeader
            fluidConnection={this.state.fluidConnection}
            navigateToHash={navigateToHash}
            localUser={this.state.localUser}
            participantCaucus={this.state.participantCaucus}
            shapeCaucus={this.state.shapeCaucus}
         />
      );
   }
}

// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   const root = createRoot(document.getElementById("reactRoot") as HTMLElement);
   root.render(
      <App />
   ); 

}