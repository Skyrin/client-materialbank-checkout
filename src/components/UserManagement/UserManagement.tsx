import Footer from "components/common/Footer/Footer";
import {
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
import UserHeader from "components/UserManagement/UserHeader/UserHeader";

export default function UserManagement() {
  return (
    <React.Fragment>
      <div className={styles.pageContent}>
        <div className={styles.pageWrapper}>
          <Switch>
            <Redirect
              exact
              from={USER_MANAGEMENT_URL}
              to={USER_ORDER_HISTORY_URL}
            />
            <Route path={USER_ORDER_HISTORY_URL} component={UserOrderHistory} />
            <Route path={USER_ACCOUNT_URL} component={UserAccount} />
            <Route path={USER_BILLING_URL} component={UserBilling} />
            <Route path={USER_SHIPPING_URL} component={UserShipping} />
          </Switch>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
