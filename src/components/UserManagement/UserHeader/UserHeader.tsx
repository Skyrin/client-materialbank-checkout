import styles from "./UserHeader.module.scss";
import cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  USER_ACCOUNT_URL,
  USER_BILLING_URL,
  USER_ORDER_HISTORY_URL,
  USER_SHIPPING_URL,
} from "constants/urls";
import { CustomerT } from "constants/types";
import { isOnMobile } from "utils/responsive";
import { AppContext, AppContextState, Modals } from "context/AppContext";

export const UserPages: { [key: string]: any } = {
  OrderHistory: {
    name: "Order History",
    url: USER_ORDER_HISTORY_URL,
  },
  Account: {
    name: "Account",
    url: USER_ACCOUNT_URL,
  },
  Billing: {
    name: "Billing",
    url: USER_BILLING_URL,
  },
  Shipping: {
    name: "Shipping",
    url: USER_SHIPPING_URL,
  },
};

type Props = {
  title: string;
  extraContent?: any;
  customer: CustomerT;
};

class UserHeader extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;

  renderButtons = () => {
    return Object.values(UserPages).map((page: any, index) => {
      return (
        <NavLink
          to={page.url}
          className={cn(styles.headerButton, {
            [styles.alignEnd]: index === 0,
          })}
          activeClassName={styles.selected}
          key={page.url}
        >
          {page.name}
        </NavLink>
      );
    });
  };

  render() {
    return (
      <div className={cn(styles.header)}>
        <div className={cn("row", styles.subHeaderTop)}>
          {!isOnMobile() && (
            <div className={styles.title}>{this.props.title}</div>
          )}

          {this.props.extraContent}
          <div className={styles.headerNav}>{this.renderButtons()}</div>
        </div>
        {this.props.customer && (
          <div className={cn("row", "margin-top", "center-vertically")}>
            <div className={styles.welcomeHint}>
              Welcome back, {this.props.customer.firstname}!
            </div>
            <div className={styles.welcomeHintGray}>Not you?</div>
            <button className={styles.logout} onClick={this.logout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    );
  }

  logout = () => {
    this.context.logout();
    this.context.openModal(Modals.Login);
  };
}

export default UserHeader;
