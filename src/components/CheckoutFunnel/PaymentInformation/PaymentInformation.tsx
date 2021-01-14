import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PaymentInformation.module.scss";
import cn from "classnames";
import {
  ORDER_CONFIRMATION_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import applePayLogo from "assets/images/apple_pay_logo_black.svg";
import payPalLogo from "assets/images/paypal_logo.svg";

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
import { CartAddressInput } from "../../../context/CheckoutAPI";
import visaCardIcon from "assets/images/visa-card.png";
import { isEqual, get } from "lodash-es";

export enum AddressOption {
  ShippingAddress = "shipping-address",
  BillingAddress = "billing-address",
}

export enum PaymentOption {
  ExistingCreditCard = "existing-credit-card",
  CreditCard = "credit-card",
  PayPal = "pay-pal",
  ApplePay = "apple-pay",
}

type Props = RouteComponentProps;

type State = {
  addressOption: AddressOption;
  paymentOption: PaymentOption;
  creditCardInfo: CreditCardFormValuesT;
  billingAddress: AddressFormValuesT;
  rememberMeCheck: boolean;
};

export class PaymentInformation extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  constructor(props: Props, context: AppContextState) {
    super(props, context);
    this.state = {
      addressOption: AddressOption.ShippingAddress,
      paymentOption:
        context.customer?.email === "test@example.com"
          ? PaymentOption.ExistingCreditCard
          : PaymentOption.CreditCard,
      creditCardInfo: DEFAULT_CREDIT_CARD_FORM_VALUES,
      billingAddress: DEFAULT_ADDRESS_FORM_VALUES,
      rememberMeCheck: true,
    };
  }

  creditCardForm?: CreditCardForm;
  billingAddressForm?: AddressForm;

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
        this.setState({
          paymentOption: PaymentOption.ExistingCreditCard,
        });
      }
    }
  };

  async onSubmit() {
    await this.setBillingAddress();
    // TODO: handle contact
    // TODO: handle payment
    // TODO: handle checkout before redirect to confirmation page
    this.props.history.push(ORDER_CONFIRMATION_URL);
  }

  async setBillingAddress() {
    const cart = this.context.cart;
    const address =
      this.state.addressOption === "shipping-address"
        ? new CartAddressInput(
            cart.shipping_addresses ? cart.shipping_addresses[0] : null
          )
        : new CartAddressInput(this.state.billingAddress);

    await this.context.setBillingAddress(address);
  }

  renderContactInfoSection = () => {
    return (
      <div className={`${styles.infoSection} ${styles.paddingContainer}`}>
        <h3 className={styles.title}>Contact</h3>
        <Link className={styles.changeButton} to={PERSONAL_INFORMATION_URL}>
          Change
        </Link>
        <div className={cn("big-text", styles.value)}>
          {this.context.customer?.email || "johndoe@gmail.com"}
        </div>
      </div>
    );
  };

  renderShipToInfoSection = () => {
    const shippingAddress =
      this.context.cart?.shipping_addresses &&
      this.context.cart?.shipping_addresses[0];
    const address = shippingAddress
      ? `${shippingAddress.street.join(" ")}, ${shippingAddress.city}, ${
          shippingAddress.region.code
        } ${shippingAddress.postcode}`
      : "236 West 30th Street 11th Floor, New York, NY 10001";
    return (
      <div className={`${styles.infoSection} ${styles.paddingContainer}`}>
        <h3 className={styles.title}>Ship To</h3>
        <Link className={styles.changeButton} to={"information"}>
          Change
        </Link>
        <div className={cn("big-text", styles.value)}>{address}</div>
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
      <div>
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
              }}
            >
              <RadioButton
                className={styles.radioButton}
                value={this.state.paymentOption}
                option={PaymentOption.ExistingCreditCard}
              />
              <div className="big-text row center-vertically">
                <img src={visaCardIcon} className={styles.cardIcon} />
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
            onClick={() => {
              this.setState({
                paymentOption: PaymentOption.PayPal,
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
        </div>
        <div className={styles.paddingContainer}>
          <div
            className="row center-vertically clickable"
            onClick={() => {
              this.setState({
                paymentOption: PaymentOption.ApplePay,
              });
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
          <a href="/">
            <span>Terms of Service</span>{" "}
          </a>
          &nbsp;and understand our&nbsp;
          <a href="/">
            <span>Privacy Policy</span>{" "}
          </a>
        </div>

        <div className={cn("margin-top-big", styles.navigationContainer)}>
          {isOnMobile() && (
            <button className="button large" onClick={() => this.onSubmit()}>
              Place My Order
            </button>
          )}

          <Link
            to={PERSONAL_INFORMATION_URL}
            className={cn("link-button", { "margin-top": isOnMobile() })}
          >
            <i className="far fa-long-arrow-left" />
            Return to information
          </Link>

          {!isOnMobile() && (
            <button className="button large" onClick={() => this.onSubmit()}>
              Checkout
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentInformation);
