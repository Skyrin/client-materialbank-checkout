import React from "react";
import cn from "classnames";
import styles from "./HistoryOrder.module.scss";
import { DateTime } from "luxon";
import {
  HistoryOrderItem,
  Item,
} from "components/common/HistoryOrderItem/HistoryOrderItem";
import { HistoryOrderDetails } from "components/common/HistoryOrderDetails/HistoryOrderDetails";
import { OrderItemT, OrderT } from "constants/types";
import { isOnMobile } from "utils/responsive";

interface Props {
  order?: {
    orderNumber: string;
    placeDate: DateTime;
    status: string;
    trackingUrl: string;
    helpUrl: string;
    items: Item[];
    details: any;
  };
  orderT: OrderT;
  shopItem?: (item: OrderItemT) => any;
}

interface State {
  isExpanded: boolean;
}

export class HistoryOrder extends React.Component<Props, State> {
  private readonly itemLimit = 3;
  state: State = {
    isExpanded: false,
  };

  private toggleExpand(): void {
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
  }

  formatDate = (stringDate: string): string => {
    const dateTime = DateTime.fromSQL(stringDate);
    return dateTime.toFormat("MMMM dd, yyyy");
  };

  renderMobileOrderInfo(order: OrderT, statusClassName) {
    return (
      <div className={cn(styles["content"], styles["header"], styles["row"])}>
        <div className={cn(styles["left-container"], styles["placement-date"])}>
          {this.formatDate(order.order_date)}
          <div className={cn(styles["light-text"], styles["order-number"])}>
            Order #{order.number}
          </div>
        </div>

        <div className={cn(styles["middle-container"], styles["container"])}>
          {/* TODO: When API available: Handle actual statuses. Also change classes in the css file */}
          <div className={styles.containerStatus}>
            <div
              className={cn(styles["status-dot"], styles[statusClassName])}
            />
            <div className={cn(styles["status-text"])}>{order.status}</div>
          </div>
        </div>
        <div className={cn(styles["right-container"], styles["container"])}>
          <button className={cn(styles.label, styles.trackPackage)}>
            Track package
          </button>
        </div>
      </div>
    );
  }

  render() {
    const order = this.props.orderT;
    const statusClassName =
      "status_" + "order.status".replace(" ", "-").toLowerCase();
    const expanded = this.state.isExpanded;

    const itemLimit = this.itemLimit;

    return (
      <div className={cn(styles["HistoryOrder"])}>
        {isOnMobile() && this.renderMobileOrderInfo(order, statusClassName)}
        {!isOnMobile() && (
          <div className={cn(styles["header"], styles["row"])}>
            <div className={cn(styles["left-container"])}>
              <div className={styles.placementDateLabel}>ORDER PLACED</div>
              <div className={styles.placementDateValue}>
                {this.formatDate(order.order_date)}
              </div>
            </div>

            <div
              className={cn(styles["middle-container"], styles["container"])}
            >
              {/* TODO: When API available: Handle actual statuses. Also change classes in the css file */}
              <div
                className={cn(styles["status-dot"], styles[statusClassName])}
              />
              <div className={cn(styles["status-text"])}>{order.status}</div>
              <button className={styles.trackPackage}>Track package</button>
            </div>

            <div className={cn("row", "center-vertically")}>
              <a className={styles.orderHelp} href={"/"}>
                Get help with this order
              </a>
              <div className={cn(styles["order-number"])}>
                Order #{order.number}
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            styles["content"],
            styles["order-items"],
            styles.orderItemsContainer
          )}
        >
          {expanded
            ? order.items.map((item) => (
                <HistoryOrderItem
                  itemT={item}
                  onClick={() => this.props.shopItem(item)}
                  key={item.product_sku}
                />
              ))
            : order.items
                .slice(0, itemLimit)
                .map((item) => (
                  <HistoryOrderItem
                    itemT={item}
                    onClick={() => this.props.shopItem(item)}
                    key={item.product_sku}
                  />
                ))}
        </div>

        {expanded && (
          <div className={cn(styles["content"], styles["order-details"])}>
            <HistoryOrderDetails orderT={order} />
          </div>
        )}

        <button
          className={cn(
            styles["content"],
            styles["expand-button"],
            expanded && styles["expanded"]
          )}
          onClick={() => this.toggleExpand()}
        >
          {expanded ? "Hide full order" : "View full order"}{" "}
          <i className="far fa-chevron-down" />
          {!expanded && order.items.length > itemLimit && (
            <div className={cn(styles["more-items-info"])}>
              + {order.items.length - itemLimit} more items
            </div>
          )}
        </button>
      </div>
    );
  }
}
