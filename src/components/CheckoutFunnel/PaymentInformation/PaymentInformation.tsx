import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS, ORDER_ID_STORAGE_KEY } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PaymentInformation.module.scss";
import cn from "classnames";
import {
  CART_URL,
  goToStorefront,
  ORDER_CONFIRMATION_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import applePayLogo from "assets/images/apple_pay_logo_black.svg";
import payPalLogo from "assets/images/paypal_logo.svg";
import googlePayLogo from "assets/images/google_pay_logo.svg";

import CreditCardForm, {
  CreditCardFormValuesT,
  DEFAULT_CREDIT_CARD_FORM_VALUES,
} from "components/common/Forms/CreditCardForm/CreditCardForm";

import Checkbox from "components/common/Checkbox/Checkbox";
import RadioButton from "components/common/RadioButton/RadioButton";
import AddressForm, {
  AddressFormValuesT,
  DEFAULT_ADDRESS_FORM_VALUES,
} from "components/common/Forms/AddressForm/AddressForm";
import EncryptionNotice from "components/common/EncryptionNotice/EncryptionNotice";
import { isOnMobile } from "utils/responsive";
import PromoCode from "components/common/PromoCode/PromoCode";
import { AppContext, AppContextState } from "../../../context/AppContext";
import { CartAddressInput } from "context/CheckoutAPI/models";
import visaCardIcon from "assets/images/visa-card.png";
import { isEqual, get } from "lodash-es";
import { scrollToTop } from "utils/general";
import Loader from "components/common/Loader/Loader";
import { RESTRequest } from "RestClient";
import { createPaypalTokenForCart } from "context/CheckoutAPI/api";
import ButtonLoader from "components/common/ButtonLoader/ButtonLoader";
import {
  loadStripe,
  Stripe,
  PaymentRequest,
  PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js";

export enum AddressOption {
  ShippingAddress = "shipping-address",
  BillingAddress = "billing-address",
}

export enum PaymentOption {
  ExistingCreditCard = "existing-credit-card",
  CreditCard = "credit-card",
  PayPal = "pay-pal",
  ApplePay = "apple-pay",
  GooglePay = "google-pay",
}

type Props = RouteComponentProps;

type State = {
  addressOption: AddressOption;
  paymentOption: PaymentOption;
  creditCardInfo: CreditCardFormValuesT;
  billingAddress: AddressFormValuesT;
  rememberMeCheck: boolean;
  isSubmitting: boolean;
  applePayPossible: boolean;
  googlePayPossible: boolean;
  stripePaymentMethod: any;
  paypalStartUrl: string;
};

export class PaymentInformation extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  stripe: Stripe;
  applePayPaymentRequest: PaymentRequest;
  googlePayPaymentRequest: PaymentRequest;

  constructor(props: Props, context: AppContextState) {
    super(props, context);
    this.oldContext = context;
    let paymentOption = context.selectedPaymentOption;
    if (!paymentOption) {
      paymentOption =
        context.customer?.email === "test@example.com"
          ? PaymentOption.ExistingCreditCard
          : PaymentOption.CreditCard;
    }
    this.state = {
      addressOption: AddressOption.ShippingAddress,
      paymentOption: paymentOption,
      creditCardInfo: DEFAULT_CREDIT_CARD_FORM_VALUES,
      billingAddress: DEFAULT_ADDRESS_FORM_VALUES,
      rememberMeCheck: true,
      isSubmitting: false,
      applePayPossible: false,
      googlePayPossible: false,
      stripePaymentMethod: null,
      paypalStartUrl: "",
    };
  }

  creditCardForm?: CreditCardForm;
  billingAddressForm?: AddressForm;

  async componentDidMount() {
    scrollToTop();
    this.stripe = await loadStripe(
      "pk_test_51I1F3fCnVrIUZxgWfN53yuaDE2trsJ1rFx7g1Nj44m3SMaCdKPuK1q7fm2IaBMnk0pB2lJsy4q0b2EP1NgiUcUaS00wwKh2Q54"
    );
    const paymentRequestOptions = {
      country: "US",
      currency: "usd",
      total: {
        label: "Total",
        amount:
          (this.context.cart.prices?.subtotal_including_tax?.value || 10) * 100, // ??????? Is it in cents?
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
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
  }

  shouldComponentUpdate = (nextProps: Props, nextState: State) => {
    this.oldContext = this.context;
    return true;
  };

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    // Listening for context changes
    if (!isEqual(this.oldContext, this.context)) {
      const oldUserEmail = get(this.oldContext, "customer.email");
      const newUserEmail = get(this.context, "customer.email");

      if (
        oldUserEmail !== newUserEmail &&
        newUserEmail === "test@example.com"
      ) {
        console.log("EMAIL CHANGED", oldUserEmail, newUserEmail);
        this.setState({
          paymentOption: PaymentOption.ExistingCreditCard,
        });
      }
    }
  };

  handleStripePaymentMethod = async (
    event: PaymentRequestPaymentMethodEvent
  ) => {
    console.log(event);
    const { complete, ...restOfEvent } = event;
    const paymentMethod = restOfEvent.paymentMethod;

    const resp = await this.setPaymentMethodAndPlaceOrder(
      paymentMethod.id,
      false
    );

    if (resp) {
      localStorage.setItem(ORDER_ID_STORAGE_KEY, resp);
      event.complete("success");
      this.props.history.push(ORDER_CONFIRMATION_URL);
    } else {
      event.complete("fail");
    }
  };

  setPaymentMethodAndPlaceOrder = async (
    stripeToken: string,
    saveCard?: boolean = false
  ) => {
    const response = await RESTRequest(
      "POST",
      "carts/mine/payment-information",
      {
        paymentMethod: {
          method: "stripe_payments",
          additional_data: {
            cc_save: saveCard,
            cc_stripejs_token: stripeToken,
          },
        },
      }
    );
    const respBody = await response.json();
    if (response.ok && respBody) {
      return respBody;
    }
    return null;
  };

  async onSubmit() {
    this.setState({
      isSubmitting: true,
    });
    await this.setBillingAddress();
    await this.context.setShippingMethod();

    if (this.state.paymentOption === PaymentOption.CreditCard) {
      const paymentMethodResponse = await this.creditCardForm.createStripePaymentMethod();
      const token = paymentMethodResponse.id;
      console.log("GOT TOKEN", token);

      const resp = await this.setPaymentMethodAndPlaceOrder(token, true);

      if (resp) {
        localStorage.setItem(ORDER_ID_STORAGE_KEY, resp);
        this.props.history.push(ORDER_CONFIRMATION_URL);
        return;
      } else {
        return;
      }
    }

    if (this.state.paymentOption === PaymentOption.GooglePay) {
      this.googlePayPaymentRequest.show();
      return;
    }

    if (this.state.paymentOption === PaymentOption.PayPal) {
      if (this.state.paypalStartUrl) {
        window.location.href = this.state.paypalStartUrl;
        return;
      }
    }
    this.props.history.push(ORDER_CONFIRMATION_URL);
  }

  async setBillingAddress() {
    const sameAsShipping =
      this.state.addressOption === AddressOption.ShippingAddress;

    if (sameAsShipping) {
      await this.context.setBillingAddress(true);
    } else {
      await this.context.setBillingAddress(
        false,
        new CartAddressInput(this.state.billingAddress)
      );
    }
  }

  renderContactInfoSection = () => {
    return (
      <div className={`${styles.infoSection} ${styles.paddingContainer}`}>
        <h3 className={styles.title}>Contact</h3>
        <Link className={styles.changeButton} to={PERSONAL_INFORMATION_URL}>
          Change
        </Link>
        <div className={cn("big-text", styles.value)}>
          {`${this.context.customer?.firstname} ${this.context.customer?.lastname}` ||
            "John Doe"}
          <br />
          {this.context.customer?.email || "johndoe@gmail.com"}
          {this.context.customerLoading && (
            <Loader
              containerClassName={styles.loaderContainer}
              loaderClassName={styles.loader}
            />
          )}
        </div>
      </div>
    );
  };

  renderShipToInfoSection = () => {
    const shippingAddress =
      this.context.cart?.shipping_addresses &&
      this.context.cart?.shipping_addresses[0];
    const contact = shippingAddress
      ? `${shippingAddress.firstname} ${shippingAddress.lastname}`
      : "John Doe";
    const address = shippingAddress
      ? `${shippingAddress.street.join(" ")}`
      : "236 West 30th Street 11th Floor";
    const cityState = shippingAddress
      ? `${shippingAddress.city}, ${shippingAddress.region.code} ${shippingAddress.postcode}`
      : "New York, NY 10001";
    return (
      <div className={`${styles.infoSection} ${styles.paddingContainer}`}>
        <h3 className={styles.title}>Ship To</h3>
        <Link className={styles.changeButton} to={"information"}>
          Change
        </Link>
        <div className={cn("big-text", styles.value)}>
          {contact}
          <br />
          {address}
          <br />
          {cityState}
        </div>
      </div>
    );
  };

  renderPromoCodeSection = () => {
    return (
      <div>
        <div className="row center-vertically margin-top full-width">
          <PromoCode className={styles.promoCode} />
        </div>
        <div className="horizontal-divider margin-top" />
      </div>
    );
  };

  renderPaymentInfoSection = () => {
    const existingUser = this.context.customer?.email === "test@example.com";

    return (
      <div className={styles.paymentSection}>
        <h3 className="margin-top">Payment</h3>
        <div className={styles.paddingContainer}>
          {existingUser && (
            <div
              className={cn(
                "row center-vertically clickable",
                styles.existingCardOption
              )}
              onClick={() => {
                this.setState({
                  paymentOption: PaymentOption.ExistingCreditCard,
                });
                this.context.setSelectedPaymentOption(
                  PaymentOption.ExistingCreditCard
                );
              }}
            >
              <RadioButton
                className={styles.radioButton}
                value={this.state.paymentOption}
                option={PaymentOption.ExistingCreditCard}
              />
              <div className="big-text row center-vertically">
                <img src={visaCardIcon} alt="" className={styles.cardIcon} />
                Saved VISA ending in 1234
              </div>
            </div>
          )}
          <div
            className="row center-vertically clickable"
            onClick={() => {
              this.setState({
                paymentOption: PaymentOption.CreditCard,
              });
              this.context.setSelectedPaymentOption(PaymentOption.CreditCard);
            }}
          >
            <RadioButton
              className={styles.radioButton}
              value={this.state.paymentOption}
              option={PaymentOption.CreditCard}
            />
            <div className="big-text">
              {existingUser ? "Use a different card" : "Credit Card"}
            </div>
          </div>

          <CreditCardForm
            useStripe
            visible={this.state.paymentOption === PaymentOption.CreditCard}
            onChange={(newValues: CreditCardFormValuesT) => {
              this.setState({
                creditCardInfo: newValues,
              });
              this.creditCardForm?.validateForm();
            }}
            componentRef={(ref) => {
              this.creditCardForm = ref;
            }}
          />
        </div>

        <div className={styles.paddingContainer}>
          <div
            className="row center-vertically clickable"
            onClick={async () => {
              this.setState({
                paymentOption: PaymentOption.PayPal,
              });
              this.context.setSelectedPaymentOption(PaymentOption.PayPal);
              const paypalTokenResponse = await createPaypalTokenForCart(
                this.context,
                this.context.cart.id
              );
              console.log(paypalTokenResponse);
              this.setState({
                paypalStartUrl: paypalTokenResponse.paypal_urls.start,
              });
            }}
          >
            <RadioButton
              className={styles.radioButton}
              value={this.state.paymentOption}
              option={PaymentOption.PayPal}
            />
            <img
              src={payPalLogo}
              alt="Pay Pal"
              className={styles.paymentLogoIcon}
            />
          </div>
          {this.state.paymentOption === PaymentOption.PayPal && (
            <div className={cn(styles.optionText, "small-text")}>
              After clicking "Place My Order", you will be redirected to PayPal
              to complete your purchase securely.
            </div>
          )}
        </div>
        {this.state.applePayPossible && (
          <div className={styles.paddingContainer}>
            <div
              className="row center-vertically clickable"
              onClick={() => {
                this.setState({
                  paymentOption: PaymentOption.ApplePay,
                });
                this.context.setSelectedPaymentOption(PaymentOption.ApplePay);
              }}
            >
              <RadioButton
                className={styles.radioButton}
                value={this.state.paymentOption}
                option={PaymentOption.ApplePay}
              />
              <img
                src={applePayLogo}
                alt="Apple Pay"
                className={styles.paymentLogoIcon}
              />
            </div>
          </div>
        )}
        {this.state.googlePayPossible && (
          <div className={styles.paddingContainer}>
            <div
              className="row center-vertically clickable"
              onClick={() => {
                this.setState({
                  paymentOption: PaymentOption.GooglePay,
                });
                this.context.setSelectedPaymentOption(PaymentOption.GooglePay);
              }}
            >
              <RadioButton
                className={styles.radioButton}
                value={this.state.paymentOption}
                option={PaymentOption.GooglePay}
              />
              <img
                src={googlePayLogo}
                alt="Google Pay"
                className={styles.paymentLogoIcon}
              />
            </div>
          </div>
        )}
        {this.context.customerLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  };

  renderAddressSection = () => {
    return (
      <div>
        <h3 className="margin-top">Billing Address</h3>
        <div
          className={cn(
            { "margin-top normal-text": !isOnMobile() },
            { "margin-top-half x-small-text": isOnMobile() }
          )}
        >
          Select the address that matches your card or payment method
        </div>

        <div
          className="row center-vertically margin-top clickable"
          onClick={() => {
            this.setState({
              addressOption: AddressOption.ShippingAddress,
            });
          }}
        >
          <RadioButton
            className={styles.radioButton}
            value={this.state.addressOption}
            option={AddressOption.ShippingAddress}
          />
          <div className="big-text">Same as shipping address</div>
        </div>
        <div
          className="row center-vertically margin-top clickable"
          onClick={() => {
            this.setState({
              addressOption: AddressOption.BillingAddress,
            });
          }}
        >
          <RadioButton
            className={styles.radioButton}
            value={this.state.addressOption}
            option={AddressOption.BillingAddress}
          />
          <div className="big-text">Use a different billing address</div>
        </div>

        <AddressForm
          withAutocomplete
          visible={this.state.addressOption === AddressOption.BillingAddress}
          onChange={(newValues: AddressFormValuesT) => {
            this.setState({
              billingAddress: newValues,
            });
          }}
          componentRef={(ref) => {
            this.billingAddressForm = ref;
          }}
        />
      </div>
    );
  };

  submitButtonIsDisabled = () => {
    if (this.state.isSubmitting) {
      return true;
    }
    if (
      this.state.paymentOption === PaymentOption.CreditCard &&
      (!this.creditCardForm || !this.creditCardForm.isValid())
    )
      return true;
    if (
      this.state.addressOption === AddressOption.BillingAddress &&
      !this.billingAddressForm.isValid()
    )
      return true;
    if (
      this.state.paymentOption === PaymentOption.PayPal &&
      !this.state.paypalStartUrl
    )
      return true;
    return false;
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PaymentInformation)}>
        {!isOnMobile() && <Logo className={styles.logo} />}

        {!isOnMobile() && (
          <Breadcrumbs
            steps={BREADCRUMBS_STEPS}
            className={styles.breadcrumbs}
          />
        )}

        {!isOnMobile() && <EncryptionNotice />}

        {this.renderContactInfoSection()}
        {this.renderShipToInfoSection()}
        {isOnMobile() && this.renderPromoCodeSection()}
        {this.renderPaymentInfoSection()}
        {this.renderAddressSection()}

        <div className="horizontal-divider margin-top" />

        <h3 className="margin-top">Remember me</h3>
        <div
          className="row center-vertically margin-top clickable"
          onClick={() => {
            this.setState({
              rememberMeCheck: !this.state.rememberMeCheck,
            });
          }}
        >
          <Checkbox
            className={styles.radioButton}
            value={this.state.rememberMeCheck}
          />
          <div className="big-text">
            Save my information for a faster checkout
          </div>
        </div>

        <div className="small-text margin-top-big">
          By placing this order, you agree to our&nbsp;
          <a href="/" className={styles.inlineLink}>
            <span>Terms of Service</span>{" "}
          </a>
          &nbsp;and understand our&nbsp;
          <a href="/" className={styles.inlineLink}>
            <span>Privacy Policy</span>{" "}
          </a>
        </div>

        <div className={cn("margin-top-big", styles.navigationContainer)}>
          {isOnMobile() && (
            <button
              className={cn("button large", {
                hasLoader: this.state.isSubmitting,
              })}
              onClick={() => this.onSubmit()}
              disabled={this.submitButtonIsDisabled()}
            >
              Place My Order
              {this.state.isSubmitting && <ButtonLoader />}
            </button>
          )}

          <div
            className={cn("link-button", { "margin-top": isOnMobile() })}
            onClick={() => {
              goToStorefront(CART_URL);
            }}
          >
            <i className="far fa-long-arrow-left" />
            Return to cart
          </div>

          {!isOnMobile() && (
            <button
              className={cn("button large", {
                hasLoader: this.state.isSubmitting,
              })}
              onClick={() => this.onSubmit()}
              disabled={this.submitButtonIsDisabled()}
            >
              Place My Order
              {this.state.isSubmitting && <ButtonLoader />}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentInformation);
