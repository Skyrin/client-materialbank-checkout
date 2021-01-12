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
import { isOnMobile } from "utils/responsive";
import RadioButton from "components/common/RadioButton/RadioButton";
import {
  AddressOption,
  PaymentOption,
} from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";
import {
  CartAddressInput,
  setGuestEmailOnCart,
} from "../../../context/CheckoutAPI";
import { setShippingAddressOnCart } from "../../../context/CheckoutAPI";
import { AppContext, AppContextT } from "../../../context/AppContext";
import { cloneDeep } from "lodash-es";

const contactInfoSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export enum ShippingAddressOption {
  Existing = "existing",
  New = "new",
}

type Props = RouteComponentProps;

type State = {
  createAccount: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  createAccountErrors: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
  };
  isLoggedIn: boolean;
  shippingAddressOption: ShippingAddressOption;
  shippingAddress: AddressFormValuesT;
};

export class PersonalInformation extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextT;

  state = {
    createAccount: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    createAccountErrors: {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
    isLoggedIn: Math.random() < 0.5,
    shippingAddressOption: ShippingAddressOption.Existing,
    shippingAddress: DEFAULT_ADDRESS_FORM_VALUES,
  };

  shippingAddressForm?: AddressForm;

  componentDidMount(): void {
    //TODO: Find a smarter way to wait from backend data
    window.setTimeout(() => {
      this.initialiseData();
    }, 1000);
  }

  initialiseData(): void {
    // TODO: Fix this for real.
    // This is stupid, but it should stop the app from crashing if the cart query takes longer than 1s
    if (!this.context.cart.shipping_addresses) {
      window.setTimeout(() => {
        this.initialiseData();
      }, 1000);
      return;
    }
    this.setState((prevState) => ({
      shippingAddress: {
        firstName: this.context.cart.shipping_addresses[0].firstname,
        lastName: this.context.cart.shipping_addresses[0].lastname,
        company: this.context.cart.shipping_addresses[0].company,
        address: this.context.cart.shipping_addresses[0].street[0],
        aptNumber: DEFAULT_ADDRESS_FORM_VALUES.aptNumber,
        zipCode: this.context.cart.shipping_addresses[0].postcode,
        phone: this.context.cart.shipping_addresses[0].telephone,
        city: this.context.cart.shipping_addresses[0].city,
      },
      createAccount: {
        ...prevState.createAccount,
        email: this.context.cart.email,
      },
    }));
  }

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
        <div className={styles.expressCheckoutFootnote}>
          Or continue to pay with a credit card
        </div>
      </React.Fragment>
    );
  };

  validateContactInfo = () => {
    try {
      contactInfoSchema.validateSync(this.state.createAccount, {
        abortEarly: false,
      });
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        createAccountErrors: {
          ...this.state.createAccountErrors,
          ...errors,
        },
      });
    }
  };

  renderContactInfoSection = () => {
    return (
      <div className={cn(styles.contactInfoSection, styles.section)}>
        <h3 className={styles.contactInfoTitle}>Contact Info</h3>
        <div className={cn(styles.loggedIn, styles.loginHint)}>
          Logged in as&nbsp;
          <span className={styles.loggedInName}>John Mock</span>
        </div>
        <a href="/" className={cn(styles.logOut, styles.loginLink)}>
          Log Out
        </a>
        <div className={styles.userName}>John Doe</div>
        <div className={styles.userEmail}>johnmock@gmail.com</div>
      </div>
    );
  };

  renderCreateAccountSection = () => {
    return (
      <div className={styles.section}>
        <div className={styles.sectionTitleLine}>
          <h3 className={styles.sectionTitle}>Create an Account</h3>
          <div>
            <span className={styles.loginHint}>Already have an account?</span>
            <a href="/" className={styles.loginLink}>
              Log In
            </a>
          </div>
        </div>
        <div className={styles.createAccountSection}>
          <Input
            className={styles.firstName}
            placeholder="First Name"
            value={this.state.createAccount.firstName}
            onChange={(val: string) => {
              this.updateField("firstName", val);
            }}
            onBlur={this.validateContactInfo}
            error={this.state.createAccountErrors.firstName}
          />
          <Input
            className={styles.lastName}
            placeholder="Last Name"
            value={this.state.createAccount.lastName}
            onChange={(val: string) => {
              this.updateField("lastName", val);
            }}
            onBlur={this.validateContactInfo}
            error={this.state.createAccountErrors.lastName}
          />
          <Input
            className={styles.email}
            placeholder="Email Address"
            value={this.state.createAccount.email}
            onChange={(val: string) => {
              this.updateField("email", val);
            }}
            onBlur={this.validateContactInfo}
            error={this.state.createAccountErrors.email}
          />
          <Input
            className={styles.password}
            placeholder="Create Password"
            value={this.state.createAccount.password}
            onChange={(val: string) => {
              this.updateField("password", val);
            }}
            onBlur={this.validateContactInfo}
            error={this.state.createAccountErrors.password}
          />
          <Input
            className={styles.confirmPassword}
            placeholder="Re-Enter Password"
            value={this.state.createAccount.confirmPassword}
            onChange={(val: string) => {
              this.updateField("confirmPassword", val);
            }}
            onBlur={this.validateContactInfo}
            error={this.state.createAccountErrors.confirmPassword}
          />
        </div>
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

        {this.state.isLoggedIn && (
          <div
            className={cn("row margin-top clickable")}
            onClick={() => {
              this.setState({
                shippingAddressOption: ShippingAddressOption.Existing,
              });
            }}
          >
            <RadioButton
              className={styles.radioButton}
              value={this.state.shippingAddressOption}
              option={ShippingAddressOption.Existing}
            />
            <div>
              <div className={styles.addressLine}>John Doe</div>
              <div className={styles.addressLine}>
                236 West 30th Street 11th Floor
              </div>
              <div className={styles.addressLine}>New York, NY 10001</div>
            </div>
          </div>
        )}
        {this.state.isLoggedIn && (
          <div
            className={cn("row margin-top clickable")}
            onClick={() => {
              this.setState({
                shippingAddressOption: ShippingAddressOption.New,
              });
            }}
          >
            <RadioButton
              className={styles.radioButton}
              value={this.state.shippingAddressOption}
              option={ShippingAddressOption.New}
            />
            <div className={styles.addressLine}>
              Use a different shipping address
            </div>
          </div>
        )}
        <AddressForm
          visible={
            this.state.shippingAddressOption === ShippingAddressOption.New ||
            !this.state.isLoggedIn
          }
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

  async onSubmit() {
    await this.setEmail();
    await this.setShippingAddress();
    // Show server errors if needed
    this.props.history.push(PAYMENT_URL);
  }

  async setEmail() {
    const cart = cloneDeep(this.context.cart);
    const resp = await setGuestEmailOnCart(
      cart.id as string,
      this.state.createAccount.email
    );
    cart.email = resp.email;
    this.context.updateCart(cart);
  }

  async setShippingAddress() {
    const cart = cloneDeep(this.context.cart);
    const resp = await setShippingAddressOnCart(
      cart.id as string,
      new CartAddressInput(this.state.shippingAddress)
    );

    const address = resp.shipping_addresses[0];
    cart.shipping_addresses = [
      {
        city: address.city,
        company: address.company,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.zipcode,
        street: address.street[0],
        telephone: address.telephone,
        region: address.region,
      },
    ];
    this.context.updateCart(cart);
  }

  render() {
    return (
      <div className={cn("funnel-page", styles.PersonalInformation)}>
        {!isOnMobile() && <Logo className={styles.logo} />}

        {!isOnMobile() && (
          <Breadcrumbs
            steps={BREADCRUMBS_STEPS}
            className={styles.breadcrumbs}
          />
        )}

        {!isOnMobile() && <EncryptionNotice />}

        <div className={styles.informationContainer}>
          {this.renderExpressCheckoutSection()}
          {this.state.isLoggedIn && this.renderContactInfoSection()}
          {!this.state.isLoggedIn && this.renderCreateAccountSection()}
          {this.renderShippingMethodSection()}
          {this.renderShippingAddressSection()}

          {isOnMobile() && <div className={cn("horizontal-divider")} />}

          <div className={styles.navigationContainer}>
            <Link
              to={CART_URL}
              className={cn("link-button", { "margin-top": isOnMobile() })}
            >
              <i className="far fa-long-arrow-left" />
              Return to cart
            </Link>
            <button
              className={cn("button large", { "margin-top": isOnMobile() })}
              onClick={() => this.onSubmit()}
              disabled={
                !contactInfoSchema.isValidSync(this.state.createAccount) ||
                (this.shippingAddressForm &&
                  !this.shippingAddressForm.isValid())
              }
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  updateField = (fieldName: string, value: string) => {
    this.setState({
      createAccount: {
        ...this.state.createAccount,
        [fieldName]: value,
      },
      createAccountErrors: {
        ...this.state.createAccountErrors,
        [fieldName]: null,
      },
    });
  };
}

export default withRouter(PersonalInformation);
