import React, { Ref } from "react";
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
import { Item } from "components/common/HistoryOrderItem/HistoryOrderItem";
import { Modal } from "components/common/Modal/Modal";

interface Props extends RouteComponentProps {}

export default class UserOrderHistory extends React.Component<Props, any> {
  // TODO: Remove this mock data when API is available
  orders = [
    {
      orderNumber: "#6677889900",
      placeDate: DateTime.local(),
      status: "In Transit",
      trackingUrl: "",
      helpUrl: "",
      items: [
        {
          id: "1",
          image:
            "https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png",
          brand: "Floor Brand",
          model: "Luxury Vinyl Plank",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 4.56,
          areaMeasurementUnit: "sq ft",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
        {
          id: "2",
          image: "",
          brand: "Floor Brand",
          model: " Vinyl Plank",
          color: "Blond Bamboo",
          currency: "$",
          pricePerSample: 7,
          pricePerArea: 4.09,
          areaMeasurementUnit: "m2",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
        {
          id: "3",
          image: "",
          brand: "Fabricbrand Co.",
          model: "Laundered Belgian Linen",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 80,
          areaMeasurementUnit: "yd",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
        {
          id: "4",
          image: "",
          brand: "Fabricbrand Co.",
          model: "Laundered Belgian Linen",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 80,
          areaMeasurementUnit: "yd",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
        {
          id: "5",
          image: "",
          brand: "Fabricbrand Co.",
          model: "Laundered Belgian Linen",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 80,
          areaMeasurementUnit: "yd",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
        {
          id: "6",
          image: "",
          brand: "Fabricbrand Co.",
          model: "Laundered Belgian Linen",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 80,
          areaMeasurementUnit: "yd",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
      ],
      details: {
        deliveryAddress: {
          name: "Anne Soandso",
          address: "123 Main Street",
          city: "Somewhere",
          state: "NY",
          postalCode: "112233",
          country: "United States",
        },
        billingAddress: {
          name: "Anne Soandso",
          address: "123 Main Street",
          city: "Somewhere",
          state: "NY",
          postalCode: "112233",
          country: "United States",
        },
        paymentDetails: {
          subtotal: 65,
          shipping: 2,
          salesTax: 7.88,
          total: 74.88,
          currency: "$",
          cardIssuer: "MASTERCARD",
          cardEnding: "0000",
        },
      },
    },
    {
      orderNumber: "#6677889901",
      placeDate: DateTime.local().minus({ day: 1, week: 1 }),
      status: "Delivered",
      trackingUrl: "",
      helpUrl: "",
      items: [
        {
          id: "1",
          image: "",
          brand: "Floor Brand",
          model: "Luxury Vinyl Plank",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 4.56,
          areaMeasurementUnit: "sq ft",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
          ],
        },
        {
          id: "2",
          image: "",
          brand: "Floor Brand",
          model: " Vinyl Plank",
          color: "Blond Bamboo",
          currency: "$",
          pricePerSample: 7,
          pricePerArea: 4.09,
          areaMeasurementUnit: "m2",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
            { link: "", name: "Alice's Local Fabrics" },
          ],
        },
        {
          id: "3",
          image: "",
          brand: "Fabricbrand Co.",
          model: "Laundered Belgian Linen",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 80,
          areaMeasurementUnit: "yd",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
      ],
      details: {
        deliveryAddress: {
          name: "Anne Soandso",
          address: "123 Main Street",
          city: "Somewhere",
          state: "NY",
          postalCode: "112233",
          country: "United States",
        },
        billingAddress: {
          name: "Anne Soandso",
          address: "123 Main Street",
          city: "Somewhere",
          state: "NY",
          postalCode: "112233",
          country: "United States",
        },
        paymentDetails: {
          subtotal: 65,
          shipping: 0,
          salesTax: 7.88,
          total: 72.88,
          currency: "$",
          cardIssuer: "VISA",
          cardEnding: "0000",
        },
      },
    },
    {
      orderNumber: "#6677889902",
      placeDate: DateTime.local().minus({ day: 10, month: 1, year: 1 }),
      status: "Canceled",
      trackingUrl: "",
      helpUrl: "",
      items: [
        {
          id: "1",
          image: "",
          brand: "Floor Brand",
          model: "Luxury Vinyl Plank",
          color: "White Oak",
          currency: "$",
          pricePerSample: 8,
          pricePerArea: 4.56,
          areaMeasurementUnit: "sq ft",
          shops: [
            {
              link: "",
              name: "Fabricbrand Co.",
              address: "123 Nearby Ave., Yourtown MO 11223",
            },
            { link: "", name: "Luxury Fabric Shop" },
          ],
        },
      ],
      details: {
        deliveryAddress: {
          name: "Anne Soandso",
          address: "123 Main Street",
          city: "Somewhere",
          state: "NY",
          postalCode: "112233",
          country: "United States",
        },
        billingAddress: {
          name: "Anne Soandso",
          address: "123 Main Street",
          city: "Somewhere",
          state: "NY",
          postalCode: "112233",
          country: "United States",
        },
        paymentDetails: {
          subtotal: 65,
          shipping: 0,
          salesTax: 7.88,
          total: 72.88,
          currency: "$",
          cardIssuer: "VISA",
          cardEnding: "0000",
        },
      },
    },
  ];
  canLoadMore: boolean = true;
  modalRef: any;

  constructor(props: Props) {
    super(props);
    this.modalRef = React.createRef();
  }

  loadMore(): void {
    //  TODO: Implement functionality once we have API
  }

  addItemToCart(item: Item): void {}

  openItemOverlay(item: Item): void {
    this.modalRef.current.open(
      <OrderItemOverlay item={item} addToCart={this.addItemToCart} />
    );
  }

  render() {
    return (
      <div className={cn(styles["UserOrderHistory"])}>
        <UserHeader
          title={UserPages.OrderHistory.name}
          extraContent={
            <SearchBar
              placeholder={"Search of order history"}
              onSearchChange={(value: string) => {
                console.log(value);
              }}
            />
          }
        />

        {this.orders.map((order) => (
          <HistoryOrder
            key={order.orderNumber}
            order={order}
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
    );
  }
}
