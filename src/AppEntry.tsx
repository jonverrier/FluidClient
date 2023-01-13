/*! Copyright TXPCo 2022 */

// React
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { createRoot } from "react-dom/client";

// FluidClient
import { FluidClient } from './FluidClient';

export interface IAppProps {

}

class AppState {
   fluidClient: FluidClient;
}

export class AppRoot extends React.Component<IAppProps, AppState> {

   constructor(props: IAppProps) {

      super(props);

      this.state = { fluidClient: new FluidClient() };
   }


   render() {
      return (<p>Hello</p>
      );
   }
}

// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   const root = createRoot(document.getElementById("reactRoot") as HTMLElement);
   root.render(
      <AppRoot />
   );
}
