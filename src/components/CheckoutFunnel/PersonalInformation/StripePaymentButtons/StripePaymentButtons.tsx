import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import {
  loadStripe,
  PaymentRequest,
  PaymentRequestShippingAddressEvent,
  PaymentRequestPaymentMethodEvent,
  Stripe,
} from "@stripe/stripe-js";
import applePayLogo from "assets/images/apple_pay_logo.svg";
import googlePayLogo from "assets/images/google_pay_logo.svg";
import cn from "classnames";
import styles from "./StripePaymentButtons.module.scss";
import { parsePhoneNumber } from "utils/general";
import { isEqual, get } from "lodash-es";
import { RESTRequest } from "RestClient";
import { getRegionFromName } from "constants/regions";

type Props = {
  className?: string;
  onTransactionApproved: Function;
};

type State = {
  googlePayPossible: boolean;
  applePayPossible: boolean;
  stripePaymentMethodId: string;
  stripeInitialized: boolean;
};

export default class StripePaymentButtons extends React.Component<
  Props,
  State
> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  stripe: Stripe;
  applePayPaymentRequest: PaymentRequest;
  googlePayPaymentRequest: PaymentRequest;

  constructor(props: Props, context: AppContextState) {
    super(props);
    this.oldContext = context;
    this.state = {
      googlePayPossible: false,
      applePayPossible: false,
      stripePaymentMethodId: "",
      stripeInitialized: false,
    };
  }

  componentDidMount() {
    this.initStripe();
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if (!isEqual(this.oldContext, this.context)) {
      const oldGrandTotal = get(
        this.oldContext,
        "cart.prices.grand_total.value",
        0
      );
      const newGrandTotal = get(this.context, "cart.prices.grand_total.value");

      if (
        this.state.stripeInitialized &&
        newGrandTotal &&
        newGrandTotal !== oldGrandTotal
      ) {
        this.updateStripeTotal();
      }
    }
    this.oldContext = this.context;
  };

  initStripe = async () => {
    // If we don't have cart data, retry stripe after 0.5s
    if (!this.context.cart.items || this.context.cart.items.length === 0) {
      window.setTimeout(this.initStripe, 500);
      return;
    }

    this.stripe = await loadStripe(
      "pk_test_51I1F3fCnVrIUZxgWfN53yuaDE2trsJ1rFx7g1Nj44m3SMaCdKPuK1q7fm2IaBMnk0pB2lJsy4q0b2EP1NgiUcUaS00wwKh2Q54"
    );

    console.log("CART", this.context.cart);
    const shipping =
      get(
        this.context.cart,
        "shipping_addresses[0].selected_shipping_method.amount.value",
        0
      ) * 100;
    const subtotal =
      get(this.context.cart, "prices.subtotal_including_tax.value", 0) * 100;
    const paymentRequestOptions = {
      country: "US",
      currency: "usd",
      displayItems: [
        {
          label: "Subtotal",
          amount: subtotal,
        },
        {
          label: "Shipping",
          amount: shipping,
        },
      ].filter((item) => item.amount !== 0),
      total: {
        label: "Total",
        amount: subtotal + shipping,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: true,
    };

    this.applePayPaymentRequest = this.stripe.paymentRequest({
      ...paymentRequestOptions,
      wallets: ["applePay"],
    });
    this.googlePayPaymentRequest = this.stripe.paymentRequest({
      ...paymentRequestOptions,
      wallets: ["googlePay", "browserCard"],
    });

    await this.updatePaymentOptionAvailability();

    this.setState({
      stripeInitialized: true,
    });
  };

  updatePaymentOptionAvailability = async () => {
    const applePayPossible = !!(await this.applePayPaymentRequest.canMakePayment());
    const googlePayPossible = !!(await this.googlePayPaymentRequest.canMakePayment());

    if (applePayPossible) {
      this.applePayPaymentRequest.on(
        "paymentmethod",
        this.handleStripePaymentMethod
      );
      this.applePayPaymentRequest.on(
        "shippingaddresschange",
        this.handleStripeShippingAddressChange
      );
    }

    if (googlePayPossible) {
      this.googlePayPaymentRequest.on(
        "paymentmethod",
        this.handleStripePaymentMethod
      );
      this.googlePayPaymentRequest.on(
        "shippingaddresschange",
        this.handleStripeShippingAddressChange
      );
    }

    console.log("APPLE POSSIBLE", applePayPossible);
    console.log("GOOGLE POSSIBLE", googlePayPossible);

    this.setState({
      applePayPossible: applePayPossible,
      googlePayPossible: googlePayPossible,
    });
  };

  updateStripeTotal = () => {
    const shipping =
      get(
        this.context.cart,
        "shipping_addresses[0].selected_shipping_method.amount.value",
        0
      ) * 100;
    const subtotal =
      get(this.context.cart, "prices.subtotal_including_tax.value", 0) * 100;
    const updateOptions = {
      displayItems: [
        {
          label: "Subtotal",
          amount: subtotal,
        },
        {
          label: "Shipping",
          amount: shipping,
        },
      ].filter((item) => item.amount !== 0),
      total: {
        label: "Total",
        amount: subtotal + shipping,
      },
    };

    this.applePayPaymentRequest.update(updateOptions);
    this.googlePayPaymentRequest.update(updateOptions);

    this.updatePaymentOptionAvailability();
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

  handleStripeShippingAddressChange = async (
    event: PaymentRequestShippingAddressEvent
  ) => {
    const { updateWith, shippingAddress } = event;
    const cartId = this.context.cart.id;
    const [shippingFirstName, shippingLastName] = (
      shippingAddress.recipient || ""
    ).split(" ");
    const region = getRegionFromName(shippingAddress.region);
    const estimatedShippingResponse = await RESTRequest(
      "POST",
      `guest-carts/${cartId}/estimate-shipping-methods`,
      {
        address: {
          firstname: shippingFirstName,
          lastname: shippingLastName,
          city: shippingAddress.city,
          region: region.name,
          region_code: region.code,
          region_id: region.id,
          street: shippingAddress.addressLine,
          postcode: shippingAddress.postalCode,
          telephone: shippingAddress.phone,
          country_id: "US",
        },
      }
    );
    const estimatedShipping = await estimatedShippingResponse.json();
    const flatrate =
      (estimatedShipping || []).find(
        (option) => option.method_code === "flatrate"
      ) || {};

    const subtotal =
      (this.context.cart?.prices?.subtotal_including_tax?.value || 0) * 100;
    const shipping = (flatrate.amount || 0) * 100;

    updateWith({
      status: "success",
      shippingOptions: [
        {
          id: "fedex",
          label: "FedEx Priority Overnight",
          detail: "",
          amount: shipping,
        },
      ],
      displayItems: [
        {
          label: "Subtotal",
          amount: subtotal,
        },
        {
          label: "Shipping",
          amount: shipping,
        },
      ],
      total: {
        label: "Total",
        amount: subtotal + shipping,
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
