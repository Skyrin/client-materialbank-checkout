import React from "react";
import styles from "./App.module.scss";
import { Redirect, Route, Switch } from "react-router-dom";
import { CHECKOUT_FUNNEL_URL, USER_MANAGEMENT_URL } from "constants/urls";
import AppContextManager from "context/AppContextManager";
import cn from "classnames";
import CheckoutFunnel from "components/CheckoutFunnel/CheckoutFunnel";
import UserManagement from "components/UserManagement/UserManagement";

function App() {
  return (
    <AppContextManager>
      <div className={styles.App}>
        <Switch>
          <Redirect exact from="/" to={CHECKOUT_FUNNEL_URL} />
          <Route path={CHECKOUT_FUNNEL_URL} component={CheckoutFunnel} />
          <Route path={USER_MANAGEMENT_URL} component={UserManagement} />
        </Switch>
      </div>
      {/* Hidden icons that should make the browser pre-load the webfonts for fas(FontAwesome Solid) and far(FontAwesome Regular) */}
      <i className={cn("fas fa-star", styles.hiddenIcon)} />
      <i className={cn("far fa-star", styles.hiddenIcon)} />
    </AppContextManager>
  );
}

export default App;
