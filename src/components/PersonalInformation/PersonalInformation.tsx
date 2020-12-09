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

const contactInfoSchema = yup.object().shape({
  email: yup.string().email().required(),
});

const shippingAddressSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  company: yup.string(),
  address: yup.string().required(),
  aptNumber: yup.string(),
  zipCode: yup
    .string()
    .matches(/[0-9]+/, "Digits Only")
    .required(),
  phone: yup.string(),
});

type Props = RouteComponentProps;

type State = {
  contactInfo: {
    email: string;
  };
  contactInfoErrors: {
    email: string | null;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    aptNumber: string;
    zipCode: string;
    phone: string;
  };
  shippingAddressErrors: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    address: string | null;
    aptNumber: string | null;
    zipCode: string | null;
    phone: string | null;
  };
};

export class PersonalInformation extends React.Component<Props, State> {
  state = {
    contactInfo: {
      email: "",
    },
    contactInfoErrors: {
      email: null,
    },
    shippingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      aptNumber: "",
      zipCode: "",
      phone: "",
    },
    shippingAddressErrors: {
      firstName: null,
      lastName: null,
      company: null,
      address: null,
      aptNumber: null,
      zipCode: null,
      phone: null,
    },
  };

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

  updateAddressField = (fieldName: string, value: string) => {
    this.setState({
      shippingAddress: {
        ...this.state.shippingAddress,
        [fieldName]: value,
      },
      shippingAddressErrors: {
        ...this.state.shippingAddressErrors,
        [fieldName]: null,
      },
    });
  };

  validateShippingAddress = () => {
    try {
      shippingAddressSchema.validateSync(this.state.shippingAddress, {
        abortEarly: false,
      });
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        shippingAddressErrors: {
          ...this.state.shippingAddressErrors,
          ...errors,
        },
      });
    }
  };

  renderShippingAddressSection = () => {
    return (
      <div className={cn(styles.section, styles.shippingAddressSection)}>
        <h3 className={styles.sectionTitle}>Shipping Address</h3>
        <div className={styles.inputLine}>
          <Input
            className={styles.input}
            placeholder="First Name*"
            value={this.state.shippingAddress.firstName}
            onChange={(val: string) => {
              this.updateAddressField("firstName", val);
            }}
            onBlur={this.validateShippingAddress}
            error={this.state.shippingAddressErrors.firstName}
          />
          <Input
            className={styles.input}
            placeholder="Last Name*"
            value={this.state.shippingAddress.lastName}
            onChange={(val: string) => {
              this.updateAddressField("lastName", val);
            }}
            onBlur={this.validateShippingAddress}
            error={this.state.shippingAddressErrors.lastName}
          />
        </div>
        <Input
          className={styles.input}
          placeholder="Company"
          value={this.state.shippingAddress.company}
          onChange={(val: string) => {
            this.updateAddressField("company", val);
          }}
          onBlur={this.validateShippingAddress}
          error={this.state.shippingAddressErrors.company}
        />
        <div
          className={styles.inputLine}
          style={{ gridTemplateColumns: "65% 35%" }}
        >
          <Input
            className={styles.input}
            placeholder="Address*"
            value={this.state.shippingAddress.address}
            onChange={(val: string) => {
              this.updateAddressField("address", val);
            }}
            onBlur={this.validateShippingAddress}
            error={this.state.shippingAddressErrors.address}
          />
          <Input
            className={styles.input}
            placeholder="Apt # / Suite"
            value={this.state.shippingAddress.aptNumber}
            onChange={(val: string) => {
              this.updateAddressField("aptNumber", val);
            }}
            onBlur={this.validateShippingAddress}
            error={this.state.shippingAddressErrors.aptNumber}
          />
        </div>
        <div className={styles.inputLine}>
          <Input
            className={styles.input}
            placeholder="Zip Code*"
            value={this.state.shippingAddress.zipCode}
            onChange={(val: string) => {
              this.updateAddressField("zipCode", val);
            }}
            onBlur={this.validateShippingAddress}
            error={this.state.shippingAddressErrors.zipCode}
          />
          <span className={styles.zipCodeDescription}>
            Enter Zip Code for City & State
          </span>
        </div>
        <Input
          className={styles.input}
          placeholder="Phone Number (optional)"
          value={this.state.shippingAddress.phone}
          onChange={(val: string) => {
            this.updateAddressField("phone", val);
          }}
          onBlur={this.validateShippingAddress}
          error={this.state.shippingAddressErrors.phone}
        />
      </div>
    );
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PersonalInformation)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />

        <div className={styles.encryptionNotice}>
          <i className={cn("fas fa-lock-alt", styles.lockIcon)} />
          This is a secure 128-bit SSL Encrypted payment. You’re safe.
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
            className="button large"
            onClick={() => {
              this.props.history.push(PAYMENT_URL);
            }}
            disabled={
              !contactInfoSchema.isValidSync(this.state.contactInfo) ||
              !shippingAddressSchema.isValidSync(this.state.shippingAddress)
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
