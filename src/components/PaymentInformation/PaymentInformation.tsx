import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PaymentInformation.module.scss";
import cn from "classnames";
import { PERSONAL_INFORMATION_URL } from "constants/urls";
import EncryptionNotice from "./EncryptionNotice/EncryptionNotice";
import RadioButton from "../common/RadioButton/RadioButton";
import applePayLogo from "../../assets/images/apple_pay_logo_black.svg";
import payPalLogo from "../../assets/images/paypal_logo.svg";

import CreditCardForm, {
  CreditCardFormValuesT,
  DEFAULT_CREDIT_CARD_FORM_VALUES,
} from "../common/Forms/CreditCardForm/CreditCardForm";
import AddressForm, {
  AddressFormValuesT,
  DEFAULT_ADDRESS_FORM_VALUES,
} from "../common/Forms/AddressForm/AddressForm";
import Checkbox from "../common/Checkbox/Checkbox";

export enum AddressOption {
  ShippingAddress = "shipping-address",
  BillingAddress = "billing-address",
}

type Props = RouteComponentProps;

type State = {
  addressOption: AddressOption;
  paymentInfo: any;
  creditCardInfo: CreditCardFormValuesT;
  billingAddress: AddressFormValuesT;
  rememberMeCheck: boolean;
};

export class PaymentInformation extends React.Component<Props, State> {
  state = {
    addressOption: AddressOption.ShippingAddress,
    paymentInfo: "credit-card",
    creditCardInfo: DEFAULT_CREDIT_CARD_FORM_VALUES,
    billingAddress: DEFAULT_ADDRESS_FORM_VALUES,
    rememberMeCheck: true,
  };

  creditCardForm?: CreditCardForm;
  billingAddressForm?: AddressForm;

  renderContactInfoSection = () => {
    return (
      <div className={`${styles.infoSection} ${styles.paddingContainer}`}>
        <h3 className={styles.title}>Contact</h3>
        <div className={styles.changeButton}>Change</div>
        <div className={cn("big-text", styles.value)}>johndoe@gmail.com</div>
      </div>
    );
  };

  renderShipToInfoSection = () => {
    return (
      <div className={`${styles.infoSection} ${styles.paddingContainer}`}>
        <h3 className={styles.title}>Ship To</h3>
        <div className={styles.changeButton}>Change</div>
        <div className={cn("big-text", styles.value)}>
          236 West 30th Street 11th Floor, New York, NY 10001
        </div>
      </div>
    );
  };

  renderPaymentInfoSection = () => {
    return (
      <div>
        <h3 className="margin-top">Payment</h3>
        <div className={styles.paddingContainer}>
          <div className="row center-vertically">
            <RadioButton
              className={styles.radioButton}
              value={this.state.paymentInfo}
              option="credit-card"
              onChange={(val: string) => {
                this.setState({ paymentInfo: val });
              }}
            />
            <div className="big-text">Credit Card</div>
          </div>

          <CreditCardForm
            visible={this.state.paymentInfo === "credit-card"}
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
          <div className="row center-vertically">
            <RadioButton
              className={styles.radioButton}
              value={this.state.paymentInfo}
              option="pay-pal"
              onChange={(val: string) => {
                this.setState({ paymentInfo: val });
              }}
            />
            <img
              src={payPalLogo}
              alt="Pay Pal"
              className={styles.paymentLogoIcon}
            />
          </div>
        </div>
        <div className={styles.paddingContainer}>
          <div className="row center-vertically">
            <RadioButton
              className={styles.radioButton}
              value={this.state.paymentInfo}
              option="apple-pay"
              onChange={(val: string) => {
                this.setState({ paymentInfo: val });
              }}
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
        <div className="margin-top normal-text">
          Select the address that matches your card or payment method
        </div>

        <div className="row center-vertically margin-top">
          <RadioButton
            className={styles.radioButton}
            value={this.state.addressOption}
            option={AddressOption.ShippingAddress}
            onChange={(val: string) => {
              this.setState({
                addressOption: val as AddressOption,
              });
            }}
          />
          <div className="big-text">Same as shipping address</div>
        </div>
        <div className="row center-vertically margin-top">
          <RadioButton
            className={styles.radioButton}
            value={this.state.addressOption}
            option={AddressOption.BillingAddress}
            onChange={(val: string) => {
              this.setState({
                addressOption: val as AddressOption,
              });
            }}
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
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        <EncryptionNotice />

        {this.renderContactInfoSection()}
        {this.renderShipToInfoSection()}
        {this.renderPaymentInfoSection()}
        {this.renderAddressSection()}

        <div className="horizontal-divider margin-top" />

        <h3 className="margin-top">Remember me</h3>
        <div className="row center-vertically margin-top">
          <Checkbox
            className={styles.radioButton}
            value={this.state.rememberMeCheck}
            onChange={(val: boolean) => {
              this.setState({
                rememberMeCheck: val,
              });
            }}
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
          <Link to={PERSONAL_INFORMATION_URL} className="link-button">
            <i className="far fa-long-arrow-left" />
            Return to information
          </Link>

          <button className="button large" disabled>
            Checkout
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentInformation);
