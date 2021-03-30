import React from "react";
import cn from "classnames";
import styles from "./HistoryOrderDetails.module.scss";
import { parseCurrency, parsePrice } from "utils/general";
import { OrderX } from "constants/orderTypes";

interface Props {
  details?: {
    deliveryAddress: Address;
    billingAddress: Address;
    paymentDetails: PaymentDetails;
  };

  orderX: OrderX;
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

  const deliveryAddress = props.orderX.address[1];
  const billingAddress = props.orderX.address[0];

  function renderCreditCard() {
    return (
      <div>
        {props.orderX.payment.type === "Credit Card" && (
          <div className={cn(styles["card-row"])}>
            <i
              className={cn(
                "fab",
                { "fa-cc-visa": props.orderX.payment.cardType === "Visa" },
                {
                  "fa-cc-mastercard":
                    props.orderX.payment.cardType === "Mastercard",
                },
                {
                  "fa-cc-amex":
                    props.orderX.payment.cardType === "American Express",
                },
                styles["card-icon"]
              )}
            />
            {props.orderX.payment.cardType} Card ending in{" "}
            {props.orderX.payment.last4}
          </div>
        )}

        {props.orderX.payment.type === "PayPal Express Checkout" && (
          <div className={cn(styles["card-row"])}>
            <i className={cn("fab", "fa-cc-paypal", styles["card-icon"])} />
            PayPal Express Checkout
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(styles["HistoryOrderDetails"])}>
      <div className={cn(styles["container"], styles["delivery"])}>
        <div className={cn(styles["title"])}>Delivery Address</div>
        <div className={cn(styles["row"])}>
          {deliveryAddress.firstname} {deliveryAddress.lastname}
        </div>
        <div className={cn(styles["row"])}>{deliveryAddress.street1}</div>
        <div className={cn(styles["row"])}>
          {deliveryAddress.city}, {deliveryAddress.state}{" "}
          {deliveryAddress.postalCode}
        </div>
        <div className={cn(styles["row"])}>{deliveryAddress.country}</div>
      </div>
      <div className={cn(styles["wrap"])}>
        <div className={cn(styles["container"], styles["billing"])}>
          <div className={cn(styles["title"])}>Billing Address</div>
          <div className={cn(styles["row"])}>
            {billingAddress.firstname} {billingAddress.lastname}
          </div>
          <div className={cn(styles["row"])}>{billingAddress.street1}</div>
          <div className={cn(styles["row"])}>
            {billingAddress.city}, {billingAddress.state}{" "}
            {billingAddress.postalCode}
          </div>
          <div className={cn(styles["row"])}>{billingAddress.country}</div>
        </div>
        <div className={cn(styles["container"], styles["payment"])}>
          <div className={cn(styles["title"])}>Payment</div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Subtotal</span>
            <span className={cn(styles["value"])}>
              {parseCurrency(props.orderX.currency)}
              {parsePrice(props.orderX.subtotal)}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Shipping</span>
            <span className={cn(styles["value"])}>
              {props?.orderX?.shipping
                ? parseCurrency(props.orderX.currency) +
                  parsePrice(props?.orderX.shipping)
                : "FREE"}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Sales Tax</span>
            <span className={cn(styles["value"])}>
              {parseCurrency(props.orderX.currency)}
              {parsePrice(props.orderX.tax)}
            </span>
          </div>
          <div className={cn(styles["row"])}>
            <span className={cn(styles["label"])}>Total</span>
            <span className={cn(styles["value"])}>
              {parseCurrency(props.orderX.total)}
              {parsePrice(props.orderX.total)}
            </span>
          </div>

          <hr className={cn(styles["hr"])} />
          {renderCreditCard()}
        </div>
      </div>
    </div>
  );
}
