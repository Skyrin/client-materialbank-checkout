import React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import { HistoryOrder } from "components/common/HistoryOrder/HistoryOrder";
import cn from "classnames";
import styles from "./UserOrderHistory.module.scss";
import { Modal } from "components/common/Modal/Modal";
import { AppContext, AppContextState } from "context/AppContext";
import Loader from "components/common/Loader/Loader";
import { RESTRequest } from "RestClient";
import { OrderX, ProductX } from "constants/orderTypes";
import { getSamplePage } from "utils/general";

interface Props extends RouteComponentProps {}

type State = {
  ordersX: OrderX[];
  searchItems: any;
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
      ordersX: [],
      searchItems: [],
    };
  }

  async componentDidMount() {
    // this.context.getOrders().then((orders) => {
    //   orders.sort((a, b) => {
    //     if (
    //       DateTime.fromSQL(a.order_date).valueOf() >=
    //       DateTime.fromSQL(b.order_date).valueOf()
    //     ) {
    //       return -1;
    //     } else {
    //       return 0;
    //     }
    //   });
    //
    //   this.setState({
    //     orders: orders,
    //   });
    // });

    this.context.setOrdersLoading(true);
    this.forceUpdate();
    const orderResponse = await this.getOrders(1, 25);
    if (orderResponse) {
      this.setState({
        ordersX: orderResponse[0].result,
      });
    }
    this.context.setOrdersLoading(false);
    this.forceUpdate();
  }

  getOrders = async (page: number = 1, limit: number = 25) => {
    const response = await RESTRequest("POST", "mine/orders", {
      page: page,
      limit: limit,
    });
    const respBody = await response.json();
    if (response.ok && respBody) {
      return respBody;
    }
    return null;
  };

  getSearchObj = async (q: string, page: number = 1, limit: number = 25) => {
    const response = await RESTRequest("POST", "mine/orders", {
      q: q, // optional Order Number
      page: page,
      limit: limit,
    });
    const resp = await response.json();
    if (response.ok && resp) {
      return resp;
    }
    return null;
  };

  loadMore(): void {
    //  TODO: Implement functionality once we have API
  }

  addItemToCart(item: ProductX): void {}

  openItemOverlay(item: ProductX, order: OrderX): void {
    // @ts-ignore
    window.location = getSamplePage(item.sku);

    // this.modalRef.current.open(
    //   <OrderItemOverlay
    //     order={order}
    //     item={item}
    //     addToCart={this.addItemToCart}
    //   />
    // );
  }

  submitSearch = async (evt) => {
    const searchResponse = await this.getSearchObj(evt.target.value, 1, 25);
    if (searchResponse) {
      this.setState({
        searchItems: searchResponse[0].result,
      });
    }
  };

  render() {
    let displayOrderItems = [...this.state.ordersX];
    if (this.state.searchItems.length > 0) {
      displayOrderItems = this.state.searchItems;
      this.canLoadMore = false;
    }
    return (
      <div>
        <div className={cn(styles["UserOrderHistory"])}>
          <UserHeader
            title={UserPages.OrderHistory.name}
            customer={this.context.customer}
            extraContent={
              <SearchBar
                placeholder={"Search of order history"}
                className={styles.searchBar}
                onSubmitSearch={(evt: any) => {
                  this.submitSearch(evt);
                }}
              />
            }
          />

          {displayOrderItems.map((order) => (
            <HistoryOrder
              key={order.number}
              orderT={order}
              shopItem={(item) => this.openItemOverlay(item, order)}
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
        {(this.context.customerLoading || this.context.isOrdersLoading()) && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  }
}
