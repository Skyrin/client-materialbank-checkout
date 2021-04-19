import {
  RESET_PASSWORD_URL,
  USER_ACCOUNT_URL,
  USER_BILLING_URL,
  USER_MANAGEMENT_URL,
  USER_ORDER_HISTORY_URL,
  USER_SHIPPING_URL,
} from "constants/urls";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import UserAccount from "./UserAccount/UserAccount";
import UserBilling from "./UserBilling/UserBilling";
import styles from "./UserManagement.module.scss";
import UserOrderHistory from "./UserOrderHistory/UserOrderHistory";
import UserShipping from "./UserShipping/UserShipping";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import Logo from "../common/Logo/Logo";
import ResetPassword from "./UserAccount/ResetPassword";
import { getSamplePage } from "../../utils/general";

export default class UserManagement extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;

  componentDidMount() {
    if (
      !this.context.isLoggedIn &&
      window.location.href.indexOf(RESET_PASSWORD_URL) == -1
    ) {
      this.context.openModal(Modals.Login);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderWrapper}>
              <Logo header circleClassName={styles.logoCircle}></Logo>
            </div>
          </div>
          <div className={styles.pageWrapper}>
            {this.context.isLoggedIn && (
              <Switch>
                <Redirect
                  exact
                  from={USER_MANAGEMENT_URL}
                  to={USER_ORDER_HISTORY_URL}
                />
                <Route
                  path={USER_ORDER_HISTORY_URL}
                  component={UserOrderHistory}
                />
                <Route path={USER_ACCOUNT_URL} component={UserAccount} />
                <Route path={USER_BILLING_URL} component={UserBilling} />
                <Route path={USER_SHIPPING_URL} component={UserShipping} />
              </Switch>
            )}
            {!this.context.isLoggedIn && (
              <Switch>
                <Route path={RESET_PASSWORD_URL} component={ResetPassword} />
              </Switch>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
