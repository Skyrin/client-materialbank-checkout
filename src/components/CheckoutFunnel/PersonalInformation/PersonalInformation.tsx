import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PersonalInformation.module.scss";
import cn from "classnames";
import { CART_URL, PAYMENT_URL } from "constants/urls";
import paypalLogo from "assets/images/paypal_logo.svg";
import applePayLogo from "assets/images/apple_pay_logo.svg";
import Input from "components/common/Input/Input";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import { DateTime } from "luxon";
import AddressForm, {
  AddressFormValuesT,
  DEFAULT_ADDRESS_FORM_VALUES,
} from "components/common/Forms/AddressForm/AddressForm";
import EncryptionNotice from "components/common/EncryptionNotice/EncryptionNotice";

const contactInfoSchema = yup.object().shape({
  email: yup.string().email().required(),
});

type Props = RouteComponentProps;

type State = {
  contactInfo: {
    email: string;
  };
  contactInfoErrors: {
    email: string | null;
  };
  shippingAddress: AddressFormValuesT;
};

export class PersonalInformation extends React.Component<Props, State> {
  state = {
    contactInfo: {
      email: "",
    },
    contactInfoErrors: {
      email: null,
    },
    shippingAddress: DEFAULT_ADDRESS_FORM_VALUES,
  };

  shippingAddressForm?: AddressForm;

  renderExpressCheckoutSection = () => {
    return (
      <React.Fragment>
        <div className={styles.section}>
          <h3 className={styles.expressCheckoutSubtitle}>Express Checkout</h3>
          <div className={styles.expressCheckoutOptions}>
            <div className={cn(styles.expressCheckoutOption, styles.paypal)}>
              <img
                src={paypalLogo}
                alt="PayPal"
                className={styles.expressCheckoutLogo}
              />
            </div>
            <div className={cn(styles.expressCheckoutOption, styles.applePay)}>
              <img
                src={applePayLogo}
                alt="Apple Pay"
                className={styles.expressCheckoutLogo}
              />
            </div>
          </div>
        </div>
        <span className={styles.expressCheckoutFootnote}>
          Or continue to pay with a credit card
        </span>
      </React.Fragment>
    );
  };

  validateContactInfo = () => {
    try {
      contactInfoSchema.validateSync(this.state.contactInfo, {
        abortEarly: false,
      });
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        contactInfoErrors: {
          ...this.state.contactInfoErrors,
          ...errors,
        },
      });
    }
  };

  renderContactInfoSection = () => {
    return (
      <div className={styles.section}>
        <div className={styles.sectionTitleLine}>
          <h3 className={styles.sectionTitle}>Contact Info</h3>
          <div>
            <span className={styles.loginHint}>Already have an account?</span>
            <a href="/" className={styles.loginLink}>
              Log In
            </a>
          </div>
        </div>
        <Input
          placeholder="Email Address"
          value={this.state.contactInfo.email}
          onChange={(val: string) => {
            this.setState({
              contactInfo: { email: val },
              contactInfoErrors: { email: null },
            });
          }}
          onBlur={this.validateContactInfo}
          error={this.state.contactInfoErrors.email}
        />
      </div>
    );
  };

  renderShippingMethodSection = () => {
    // TODO: Clarify if this is always going to be "tomorrow" or if we need a dynamic value here
    const estimatedDeliveryDate = DateTime.local().plus({ days: 1 });

    return (
      <div className={cn(styles.section, styles.shippingMethodSection)}>
        <h3 className={styles.sectionTitle}>Shipping Method</h3>
        <div className={styles.method}>
          <div className={styles.methodInfo}>
            <span className={styles.methodName}>FedEx Priority Overnight</span>
            <span className={styles.methodEstimatedDelivery}>
              {`Delivery tomorrow, ${estimatedDeliveryDate.toFormat(
                "MMMM dd, yyyy"
              )}.`}
            </span>
          </div>
          <span className={styles.methodPrice}>FREE</span>
        </div>
      </div>
    );
  };

  renderShippingAddressSection = () => {
    return (
      <div className={cn(styles.section, styles.shippingAddressSection)}>
        <h3 className={styles.sectionTitle}>Shipping Address</h3>
        <AddressForm
          onChange={(newValues: AddressFormValuesT) => {
            this.setState({
              shippingAddress: newValues,
            });
          }}
          componentRef={(ref) => {
            this.shippingAddressForm = ref;
          }}
        />
      </div>
    );
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PersonalInformation)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        <div className={styles.encryptionNoticeContainer}>
          <EncryptionNotice />
        </div>
        {this.renderExpressCheckoutSection()}
        {this.renderContactInfoSection()}
        {this.renderShippingMethodSection()}
        {this.renderShippingAddressSection()}

        <div className={styles.navigationContainer}>
          <Link to={CART_URL} className="link-button">
            <i className="far fa-long-arrow-left" />
            Return to cart
          </Link>
          <button
            className={`button large ${styles.continueButton}`}
            onClick={() => {
              this.props.history.push(PAYMENT_URL);
            }}
            disabled={
              !contactInfoSchema.isValidSync(this.state.contactInfo) ||
              (this.shippingAddressForm && !this.shippingAddressForm.isValid())
            }
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(PersonalInformation);
