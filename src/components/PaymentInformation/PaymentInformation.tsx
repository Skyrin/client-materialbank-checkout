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
import Input from "../common/Input/Input";
import {
  cardNumberInputFormatter,
  cardNumberInputParser,
  digitsOnlyInputParser,
  expirationDateInputFormatter,
  expirationDateInputParser,
} from "../common/Input/utils";

type Props = RouteComponentProps;

type State = {
  paymentInfo: any;
  cardNumberInput: string;
  cardExpirationInput: string;
  cardCvvInput: string;
  cardNameInput: string;
};

export class PaymentInformation extends React.Component<Props, State> {
  state = {
    paymentInfo: "",
    cardNumberInput: "",
    cardExpirationInput: "",
    cardCvvInput: "",
    cardNameInput: "",
  };

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

          <div
            className={cn(styles.creditCardArea, {
              [styles.visible]: this.state.paymentInfo === "credit-card",
            })}
          >
            <Input
              className={styles.cardNumberArea}
              value={this.state.cardNumberInput}
              onChange={(val: string) =>
                this.setState({ cardNumberInput: val })
              }
              formatter={cardNumberInputFormatter}
              parser={cardNumberInputParser}
              placeholder="Card Number"
              inputMode="numeric"
            />
            <Input
              className={styles.expirationArea}
              value={this.state.cardExpirationInput}
              onChange={(val: string) =>
                this.setState({ cardExpirationInput: val })
              }
              formatter={expirationDateInputFormatter}
              parser={expirationDateInputParser}
              placeholder="Expiration (MM/YR)"
              inputMode="numeric"
            />
            <Input
              className={styles.cvvArea}
              value={this.state.cardCvvInput}
              onChange={(val: string) => this.setState({ cardCvvInput: val })}
              parser={digitsOnlyInputParser}
              placeholder="CVV"
              inputMode="numeric"
            />
            <Input
              className={styles.cardNameArea}
              value={this.state.cardNameInput}
              onChange={(val: string) => this.setState({ cardNameInput: val })}
              placeholder="Normal text input"
            />
          </div>
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

  render() {
    return (
      <div className={cn("funnel-page", styles.PaymentInformation)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        <EncryptionNotice />

        {this.renderContactInfoSection()}
        {this.renderShipToInfoSection()}
        {this.renderPaymentInfoSection()}

        <div className={styles.navigationContainer}>
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
