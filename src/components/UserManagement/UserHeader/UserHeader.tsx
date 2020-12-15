import styles from "./UserHeader.module.scss";
import cn from "classnames";
import * as React from "react";
import searchIcon from "assets/images/search_icon.svg";

export enum PageOption {
  OrderHistory = "order-history",
  Account = "account",
  Billing = "billing",
  Shipping = "shipping",
}

type Props = {
  title: string;
};

type State = {
  selectedPage: PageOption;
};

class UserHeader extends React.Component<Props, any> {
  state = {
    selectedPage: PageOption.OrderHistory,
  };

  buttons = [
    { name: "Order History", page: PageOption.OrderHistory },
    { name: "Account", page: PageOption.Account },
    { name: "Billing", page: PageOption.Billing },
    { name: "Shipping", page: PageOption.Shipping },
  ];

  renderButtons = () => {
    return this.buttons.map((button, index) => {
      return (
        <button
          className={cn(
            styles.headerButton,
            { [styles.alignEnd]: index === 0 },
            { [styles.selected]: this.state.selectedPage === button.page }
          )}
          onClick={() => {
            this.setState({ selectedPage: button.page });
          }}
        >
          {button.name}
        </button>
      );
    });
  };

  render() {
    return (
      <div className="row bottom-vertically">
        <div className={styles.title}>Order History</div>
        <div className={styles.searchBar}>
          <img
            src={searchIcon}
            alt="Search Icon"
            className={styles.searchIcon}
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for order history"
          />
        </div>

        {this.renderButtons()}
      </div>
    );
  }
}

export default UserHeader;
