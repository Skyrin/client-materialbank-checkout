import styles from "./UserHeader.module.scss";
import cn from "classnames";
import * as React from "react";
import searchIcon from "assets/images/search_icon.svg";
import { NavLink } from "react-router-dom";
import {
  USER_ACCOUNT_URL,
  USER_BILLING_URL,
  USER_ORDER_HISTORY_URL,
  USER_SHIPPING_URL,
} from "constants/urls";

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
    console.log(this.renderButtons());
    return (
      <div className="row bottom-vertically">
        <div className={styles.title}>{this.props.title}</div>
        {this.props.extraContent}
        {this.renderButtons()}
      </div>
    );
  }
}

export default UserHeader;
