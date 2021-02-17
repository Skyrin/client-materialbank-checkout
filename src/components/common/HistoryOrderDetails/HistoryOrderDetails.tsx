import React from "react";
import cn from "classnames";
import styles from "./HistoryOrderDetails.module.scss";
import { OrderT } from "constants/types";

interface Props {
  details?: {
    deliveryAddress: Address;
    billingAddress: Address;
    paymentDetails: PaymentDetails;
  };

  orderT: OrderT;
}

interface Address {
  name: string;
  address: string;
  city: string;
  stateShort: string;
  postalCode: string;
  country: string;
}

interface PaymentDetails {
  subtotal: number;
  shipping: number;
  salesTax: number;
  total?: number;
  currency: string;
  cardIssuer: string;
  cardEnding: string;
}

export function HistoryOrderDetails(props: Props) {
  // const { deliveryAddress, billingAddress, paymentDetails } = props.details;

  const deliveryAddress = props.orderT.shipping_address;
  const billingAddress = props.orderT.billing_address;

  return (
    <div className={cn(styles["HistoryOrderDetails"])}>
      <div className={cn(styles["container"], styles["delivery"])}>
        <div className={cn(styles["title"])}>Delivery Address</div>
        <div className={cn(styles["row"])}>
          {deliveryAddress.firstname} {deliveryAddress.lastname}
        </div>
        <div className={cn(styles["row"])}>{deliveryAddress.street}</div>
        <div className={cn(styles["row"])}>
          {deliveryAddress.city}, {deliveryAddress.region}{" "}
          {deliveryAddress.postcode}
        </div>
        <div className={cn(styles["row"])}>{deliveryAddress.country_code}</div>
      </div>
      <div className={cn(styles["wrap"])}>
        <div className={cn(styles["container"], styles["billing"])}>
          <div className={cn(styles["title"])}>Billing Address</div>
          <div className={cn(styles["row"])}>
            {billingAddress.firstname} {billingAddress.lastname}
          </div>
          <div className={cn(styles["row"])}>{billingAddress.street}</div>
          <div className={cn(styles["row"])}>
            {billingAddress.city}, {billingAddress.region}{" "}
            {billingAddress.postcode}
          </div>
          <div className={cn(styles["row"])}>{billingAddress.country_code}</div>
        </div>
        <div className={cn(styles["container"], styles["payment"])}>
          <div className={cn(styles["title"])}>Payment</div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Subtotal</span>
            <span className={cn(styles["value"])}>
              {props.orderT.total.subtotal.currency}
              {props.orderT.total.subtotal.value}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Shipping</span>
            <span className={cn(styles["value"])}>
              {"paymentDetails.shipping"
                ? "paymentDetails.currency + paymentDetails.shipping"
                : "FREE"}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Sales Tax</span>
            <span className={cn(styles["value"])}>
              {"paymentDetails.currency"}
              {"paymentDetails.salesTax"}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Total</span>
            <span className={cn(styles["value"])}>
              {"paymentDetails.currency"}
              {"paymentDetails.total"}
            </span>
          </div>

          <hr className={cn(styles["hr"])} />
          <div className={cn(styles["card-row"])}>
            <i
              className={cn(
                "fab",
                "paymentDetails.cardIssuer" === "VISA"
                  ? "fa-cc-visa"
                  : "fa-cc-mastercard",
                styles["card-icon"]
              )}
            />
            Card ending in {"paymentDetails.cardEnding"}
          </div>
        </div>
      </div>
    </div>
  );
}
