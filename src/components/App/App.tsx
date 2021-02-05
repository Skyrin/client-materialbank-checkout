import React from "react";
import styles from "./App.module.scss";
import { Redirect, Route, Switch } from "react-router-dom";
import { CHECKOUT_FUNNEL_URL, USER_MANAGEMENT_URL } from "constants/urls";
import cn from "classnames";
import CheckoutFunnel from "components/CheckoutFunnel/CheckoutFunnel";
import UserManagement from "components/UserManagement/UserManagement";
import { isOnMobile } from "utils/responsive";
import { AppContext, AppContextState } from "context/AppContext";
import {
  AUTH_TOKEN_STORAGE_KEY,
  GUEST_CART_ID_STORAGE_KEY,
} from "constants/general";

class App extends React.Component {
  static contextType = AppContext;
  context!: AppContextState;
  oldIsOnMobile = isOnMobile();

  resizeHandler = () => {
    // If isOnMobile toggles, force a re-render of the app
    const newIsOnMobile = isOnMobile();
    if (newIsOnMobile !== this.oldIsOnMobile) {
      this.oldIsOnMobile = newIsOnMobile;
      this.forceUpdate();
    }
  };

  async componentDidMount() {
    window.addEventListener("resize", this.resizeHandler);
    if (localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
      await this.context.requestCurrentCustomer();
      await this.context.requestCartInfo();

      // TODO: Remove this once the storefront will have support for logged-in customers
      const storageGuestCartId = localStorage.getItem(
        GUEST_CART_ID_STORAGE_KEY
      );
      if (storageGuestCartId) {
        await this.context.mergeGuestCart();
      }
    } else {
      const storageGuestCartId = localStorage.getItem(
        GUEST_CART_ID_STORAGE_KEY
      );
      if (storageGuestCartId) {
        await this.context.requestCartInfo(storageGuestCartId);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  render() {
    return (
      <React.Fragment>
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
        <i className={cn("fab fa-cc-visa", styles.hiddenIcon)} />
      </React.Fragment>
    );
  }
}

export default App;
