/*! Copyright TXPCo 2022 */

// React
import React from 'react';
import { createRoot } from "react-dom/client";

// Other 3rd party imports
import { log, LogLevel, tag } from 'missionlog';

// Local
import { uuid } from './Uuid';
import { IKeyValueStore, localKeyValueStore, KeyValueStoreKeys } from './KeyValueStore';
import { Interest, ObserverInterest, NotificationRouterFor, NotificationFor } from './NotificationFramework';
import { Persona } from './Persona';
import { Participants } from './Participants';
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
   participants: Participants;
   fluidConnection: FluidConnection;
}

function makeLocalUser(): Persona {

   var localStore: IKeyValueStore = localKeyValueStore();

   // Look up the UUID if it is stored, else create a new one and save it
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

function navigateToHash(id: string): void {

   if (location.protocol === 'file') //  Don't attempt to rejoin local Whiteboard as they are ephemeral
      return;

   if (id) {
      log.debug(tag.application, "Navigating to:" + id);
      window.location.hash = '#' + id;
   }
}

function checkNavigateToLastBoard(): void {

   var localStore: IKeyValueStore = localKeyValueStore();

   // Look up the UUID for last Whiteboard if it is stored
   var localWhiteboardUuid: string = localStore.getItem(KeyValueStoreKeys.localWhiteboardUuid);
   if (localWhiteboardUuid) {
      navigateToHash(localWhiteboardUuid);
   }
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

      checkNavigateToLastBoard();

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
         <WhiteboardToolsHeader fluidConnection={this.state.fluidConnection} participants={this.state.participants} navigateToHash={navigateToHash} />
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