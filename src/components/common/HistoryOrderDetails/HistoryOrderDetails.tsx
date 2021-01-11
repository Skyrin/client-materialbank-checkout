import React from "react";
import cn from "classnames";
import styles from "./HistoryOrderDetails.module.scss";

interface Props {
  details: {
    deliveryAddress: Address;
    billingAddress: Address;
    paymentDetails: PaymentDetails;
  };
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
  const { deliveryAddress, billingAddress, paymentDetails } = props.details;
  return (
    <div className={cn(styles["HistoryOrderDetails"])}>
      <div className={cn(styles["container"], styles["delivery"])}>
        <div className={cn(styles["title"])}>Delivery Address</div>
        <div className={cn(styles["row"])}>{deliveryAddress.name}</div>
        <div className={cn(styles["row"])}>{deliveryAddress.address}</div>
        <div className={cn(styles["row"])}>
          {deliveryAddress.city}, {deliveryAddress.stateShort}{" "}
          {deliveryAddress.postalCode}
        </div>
        <div className={cn(styles["row"])}>{deliveryAddress.country}</div>
      </div>
      <div className={cn(styles["wrap"])}>
        <div className={cn(styles["container"], styles["billing"])}>
          <div className={cn(styles["title"])}>Billing Address</div>
          <div className={cn(styles["row"])}>{billingAddress.name}</div>
          <div className={cn(styles["row"])}>{billingAddress.address}</div>
          <div className={cn(styles["row"])}>
            {billingAddress.city}, {billingAddress.stateShort}{" "}
            {billingAddress.postalCode}
          </div>
          <div className={cn(styles["row"])}>{billingAddress.country}</div>
        </div>
        <div className={cn(styles["container"], styles["payment"])}>
          <div className={cn(styles["title"])}>Payment</div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Subtotal</span>
            <span className={cn(styles["value"])}>
              {paymentDetails.currency}
              {paymentDetails.subtotal}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Shipping</span>
            <span className={cn(styles["value"])}>
              {paymentDetails.shipping
                ? paymentDetails.currency + paymentDetails.shipping
                : "FREE"}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Sales Tax</span>
            <span className={cn(styles["value"])}>
              {paymentDetails.currency}
              {paymentDetails.salesTax}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Total</span>
            <span className={cn(styles["value"])}>
              {paymentDetails.currency}
              {paymentDetails.total}
            </span>
          </div>

          <hr className={cn(styles["hr"])} />
          <div className={cn(styles["card-row"])}>
            <i
              className={cn(
                "fab",
                paymentDetails.cardIssuer === "VISA"
                  ? "fa-cc-visa"
                  : "fa-cc-mastercard",
                styles["card-icon"]
              )}
            />
            Card ending in {paymentDetails.cardEnding}
          </div>
        </div>
      </div>
    </div>
  );
}
