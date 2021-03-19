import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import { loadStripe, PaymentRequest, Stripe } from "@stripe/stripe-js";
import applePayLogo from "assets/images/apple_pay_logo.svg";
import googlePayLogo from "assets/images/google_pay_logo.svg";
import cn from "classnames";
import styles from "./StripePaymentButtons.module.scss";

type Props = {
  className?: string;
  onTransactionApproved: Function;
};

type State = {
  googlePayPossible: boolean;
  applePayPossible: boolean;
  stripePaymentMethodId: string;
};

export default class StripePaymentButtons extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  stripe: Stripe;
  applePayPaymentRequest: PaymentRequest;
  googlePayPaymentRequest: PaymentRequest;

  state = {
    googlePayPossible: true,
    applePayPossible: true,
    stripePaymentMethodId: "",
  };

  componentDidMount() {
    this.initStripe();
  }

  initStripe = async () => {
    // If we don't have cart data, retry stripe after 0.5s
    if (!this.context.cart.items || this.context.cart.items.length === 0) {
      window.setTimeout(this.initStripe, 500);
      return;
    }

    this.stripe = await loadStripe(
      "pk_test_51I1F3fCnVrIUZxgWfN53yuaDE2trsJ1rFx7g1Nj44m3SMaCdKPuK1q7fm2IaBMnk0pB2lJsy4q0b2EP1NgiUcUaS00wwKh2Q54"
    );
    const paymentRequestOptions = {
      country: "US",
      currency: "usd",
      total: {
        label: "Total",
        amount:
          (this.context.cart.prices?.subtotal_including_tax?.value || 0) * 100, // ??????? Is it in cents?
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: "fedex",
          label: "FedEx Priority Overnight",
          amount: 0,
        },
      ],
    };
    this.applePayPaymentRequest = this.stripe.paymentRequest({
      ...paymentRequestOptions,
      wallets: ["applePay"],
    });
    this.googlePayPaymentRequest = this.stripe.paymentRequest({
      ...paymentRequestOptions,
      wallets: ["googlePay", "browserCard"],
    });
    const applePayPossible = !!(await this.applePayPaymentRequest.canMakePayment());
    const googlePayPossible = !!(await this.googlePayPaymentRequest.canMakePayment());

    if (applePayPossible) {
      this.applePayPaymentRequest.on(
        "paymentmethod",
        this.handleStripePaymentMethod
      );
    }

    if (googlePayPossible) {
      this.googlePayPaymentRequest.on(
        "paymentmethod",
        this.handleStripePaymentMethod
      );
    }

    console.log("APPLE POSSIBLE", applePayPossible);
    console.log("GOOGLE POSSIBLE", googlePayPossible);

    this.setState({
      applePayPossible: applePayPossible,
      googlePayPossible: googlePayPossible,
    });
  };

  handleStripePaymentMethod = async (
    event: PaymentRequestPaymentMethodEvent
  ) => {
    const { complete, ...restOfEvent } = event;
    const paymentMethod = restOfEvent.paymentMethod;
    console.log("GOT EVENT", event);

    const [firstName, lastName] = (restOfEvent.payerName || "").split(" ");
    const [shippingFirstName, shippingLastName] = (
      restOfEvent.shippingAddress?.recipient || ""
    ).split(" ");

    complete("success");
    this.props.onTransactionApproved({
      stripePaymentMethodId: paymentMethod.id,
      customer: {
        firstname: firstName,
        lastname: lastName,
        email: restOfEvent.payerEmail,
      },
      shippingAddress: {
        firstName: shippingFirstName || "",
        lastName: shippingLastName || "",
        city: restOfEvent.shippingAddress?.city || "",
        region: restOfEvent.shippingAddress?.region || "",
        address: (restOfEvent.shippingAddress?.addressLine || [])[0] || "",
        aptNumber: (restOfEvent.shippingAddress?.addressLine || [])[1] || "",
        zipCode: restOfEvent.shippingAddress?.postalCode || "",
        phone: parsePhoneNumber(restOfEvent.shippingAddress?.phone || ""),
      },
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.applePayPossible && (
          <div
            className={cn(this.props.className, styles.applePay)}
            onClick={() => {
              this.applePayPaymentRequest.show();
            }}
          >
            <img
              src={applePayLogo}
              alt="Apple Pay"
              className={styles.paymentLogo}
            />
          </div>
        )}
        {this.state.googlePayPossible && (
          <div
            className={cn(this.props.className, styles.googlePay)}
            onClick={() => {
              this.googlePayPaymentRequest.show();
            }}
          >
            <img
              src={googlePayLogo}
              alt="Google Pay"
              className={styles.paymentLogo}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}
