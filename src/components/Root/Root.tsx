import * as React from "react";
import App from "components/App/App";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import AppContextManager from "context/AppContextManager";

const history = createBrowserHistory();

export default function Root() {
  return (
    <AppContextManager>
      <Router history={history}>
        <App />
      </Router>
    </AppContextManager>
  );
}
