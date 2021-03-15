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
          <div className={styles.title}>{this.props.title}</div>
          {this.props.extraContent}
          <div className={styles.headerNav}>{this.renderButtons()}</div>
        </div>
        {this.props.customer && (
          <div className={cn("row", "margin-top")}>
            <div className={styles.welcomeHint}>
              Welcome back, {this.props.customer.firstname}!
            </div>
            <div className={styles.welcomeHintGray}>Not you?</div>
            <button className={styles.logout}>Log Out</button>
          </div>
        )}
      </div>
    );
  }
}

export default UserHeader;
