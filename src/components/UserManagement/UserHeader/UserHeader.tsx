import styles from "./UserHeader.module.scss";
import cn from "classnames";
import * as React from "react";
import searchIcon from "assets/images/search_icon.svg";
import { NavLink } from "react-router-dom";

export enum PageOption {
  OrderHistory = "order-history",
  Account = "account",
  Billing = "billing",
  Shipping = "shipping",
}

type Props = {
  title: string;
  extraContent?: any;
};

class UserHeader extends React.Component<Props, any> {
  pages = [
    { name: "Order History", id: PageOption.OrderHistory },
    { name: "Account", id: PageOption.Account },
    { name: "Billing", id: PageOption.Billing },
    { name: "Shipping", id: PageOption.Shipping },
  ];

  renderButtons = () => {
    return this.pages.map((button, index) => {
      return (
        <NavLink
          to={button.id}
          className={cn(styles.headerButton, {
            [styles.alignEnd]: index === 0,
          })}
          activeClassName={styles.selected}
          key={button.id}
        >
          {button.name}
        </NavLink>
      );
    });
  };

  render() {
    let page = this.pages.find((page) => {
      return page.id === this.props.title;
    });
    page = !page ? this.pages[0] : page;

    return (
      <div className="row bottom-vertically">
        <div className={styles.title}>{page.name}</div>
        {this.props.extraContent}
        {this.renderButtons()}
      </div>
    );
  }
}

export default UserHeader;
