import React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import { HistoryOrder } from "components/common/HistoryOrder/HistoryOrder";
import cn from "classnames";
import styles from "./UserOrderHistory.module.scss";
import { DateTime } from "luxon";
import { OrderItemOverlay } from "components/common/OrderItemOverlay/OrderItemOverlay";
import { Modal } from "components/common/Modal/Modal";
import { AppContext, AppContextState } from "context/AppContext";
import Loader from "components/common/Loader/Loader";
import { OrderItemT, OrderT } from "constants/types";
import { isOnMobile } from "../../../utils/responsive";
import LogoMobile from "../../common/LogoMobile/LogoMobile";

interface Props extends RouteComponentProps {}

type State = {
  orders: OrderT[];
};

export default class UserOrderHistory extends React.Component<Props, State> {
  canLoadMore: boolean = true;
  modalRef: any;
  static contextType = AppContext;
  context!: AppContextState;

  constructor(props: Props) {
    super(props);
    this.modalRef = React.createRef();
    this.state = {
      orders: [],
    };
  }

  componentDidMount() {
    this.context.getOrders().then((orders) => {
      orders.sort((a, b) => {
        if (
          DateTime.fromSQL(a.order_date).valueOf() >=
          DateTime.fromSQL(b.order_date).valueOf()
        ) {
          return -1;
        } else {
          return 0;
        }
      });

      this.setState({
        orders: orders,
      });
    });
  }

  loadMore(): void {
    //  TODO: Implement functionality once we have API
  }

  addItemToCart(item: OrderItemT): void {}

  openItemOverlay(item: OrderItemT): void {
    this.modalRef.current.open(
      <OrderItemOverlay item={item} addToCart={this.addItemToCart} />
    );
  }

  render() {
    return (
      <div>
        <div className={cn(styles["UserOrderHistory"])}>
          {isOnMobile() && <LogoMobile />}

          <UserHeader
            title={UserPages.OrderHistory.name}
            customer={this.context.customer}
            extraContent={
              <SearchBar
                placeholder={"Search of order history"}
                className={styles.searchBar}
                onSearchChange={(value: string) => {
                  console.log(value);
                }}
              />
            }
          />

          {this.state.orders.map((order) => (
            <HistoryOrder
              key={order.number}
              orderT={order}
              shopItem={(item) => this.openItemOverlay(item)}
            />
          ))}

          {this.canLoadMore && (
            <button
              className={styles["load-more-button"]}
              onClick={() => this.loadMore()}
            >
              LOAD MORE
            </button>
          )}
          <Modal ref={this.modalRef} />
        </div>
        {this.context.isOrdersLoading() && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  }
}
