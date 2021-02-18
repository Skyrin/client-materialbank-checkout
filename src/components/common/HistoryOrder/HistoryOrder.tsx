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
import moment from "moment";

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
    var date = moment(stringDate, "YYYY-MM-DD HH:mm:ss");
    return date.format("MMMM DD, YYYY");
  };

  render() {
    const order = this.props.orderT;
    const statusClassName =
      "status_" + "order.status".replace(" ", "-").toLowerCase();
    const expanded = this.state.isExpanded;

    const itemLimit = this.itemLimit;

    return (
      <div className={cn(styles["HistoryOrder"])}>
        <div className={cn(styles["content"], styles["header"], styles["row"])}>
          <div
            className={cn(
              styles["left-container"],
              styles["container"],
              styles["placement-date"]
            )}
          >
            <span>Order placed&nbsp;</span> {this.formatDate(order.order_date)}
          </div>

          <div className={cn(styles["middle-container"], styles["container"])}>
            {/* TODO: When API available: Handle actual statuses. Also change classes in the css file */}
            <div
              className={cn(styles["status-dot"], styles[statusClassName])}
            />
            <div className={cn(styles["status-text"])}>{order.status}</div>
            <a className={styles.label} href={"order.trackingUrl"}>
              Track package
            </a>
          </div>

          <div className={cn(styles["right-container"], styles["container"])}>
            <a className={styles.label} href={"order.helpUrl"}>
              Get help with this order
            </a>
            <div className={cn(styles["light-text"], styles["order-number"])}>
              Order #{order.number}
            </div>
          </div>
        </div>

        <div className={cn(styles["content"], styles["order-items"])}>
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
          {expanded ? "Hide full order" : "Show full order"}{" "}
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
