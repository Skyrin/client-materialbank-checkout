import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PersonalInformation.module.scss";
import cn from "classnames";
import {
  MAIN_SHOP_URL,
  ORDER_CONFIRMATION_URL,
  PAYMENT_URL,
} from "constants/urls";
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
import { AppContext, AppContextState } from "../../../context/AppContext";
import { isEqual, get } from "lodash-es";
import { CreateCustomerInput, CustomerAddressInput } from "context/CustomerAPI";
import { scrollToTop } from "utils/general";
import Loader from "components/common/Loader/Loader";
import { graphqlRequest } from "GraphqlClient";
import { PaymentOption } from "../PaymentInformation/PaymentInformation";

const contactInfoSchema = yup.object().shape({
  firstname: yup.string().required("Required"),
  lastname: yup.string().required("Required"),
  email: yup.string().email().required("Required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Password must be at least 8 characters and contain an uppercase letter, a lowercase one and a special character"
    )
    .required("Required"),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("password")], "Passwords don't match"),
});

declare var paypal: any;

type Props = RouteComponentProps;

type State = {
  createAccount: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  createAccountErrors: {
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
  };
  selectedShippingAddressId: number;
  shippingAddress: AddressFormValuesT;
  paypalExpressInfo: {
    token: string;
    payer_id: string;
  };
  isSubmitting: boolean;
};

export class PersonalInformation extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  constructor(props: Props, context: AppContextState) {
    super(props, context);
    this.oldContext = context;
    this.state = {
      createAccount: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      createAccountErrors: {
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        confirmPassword: null,
      },
      selectedShippingAddressId: context.customer?.addresses
        ? this.getDefaultSelectedShippingAddressId(context)
        : -1,
      shippingAddress: DEFAULT_ADDRESS_FORM_VALUES,
      paypalExpressInfo: {
        token: "",
        payer_id: "",
      },
      isSubmitting: false,
    };
  }

  getDefaultSelectedShippingAddressId = (context?: AppContextState) => {
    const usedContext = context || this.context;
    const customerAddresses = usedContext.customer?.addresses || [];
    const customerDefaultShipping = usedContext.customer?.default_shipping;
    const cartAddress = (usedContext.cart?.shipping_addresses || [])[0];

    // If there's no shipping address on the cart, try to get customer default
    if (!cartAddress) {
      if (customerDefaultShipping) {
        return parseInt(customerDefaultShipping);
      }
      return -1;
    }

    // If there is a shipping address on the cart, match the existing one on the customer and return its id
    // Magento, for whatever reason, does not allow us to get the address id from the cart object...
    const foundAddress = customerAddresses.find((customerAddress) => {
      if (cartAddress.city !== customerAddress.city) return false;
      if (cartAddress.region.code !== customerAddress.region.region_code)
        // Come on magento...
        return false;
      if (cartAddress.firstname !== customerAddress.firstname) return false;
      if (cartAddress.lastname !== customerAddress.lastname) return false;
      if (!isEqual(cartAddress.street, customerAddress.street)) return false;
      return true;
    });
    if (foundAddress) {
      return foundAddress.id;
    }
    return -1;
  };

  shippingAddressForm?: AddressForm;

  componentDidMount() {
    scrollToTop();

    console.log(paypal);
    paypal
      .Buttons({
        style: {
          height: 40,
        },
        createOrder: this.createPaypalToken,
        onApprove: this.handlePaypalTransactionApprove,
      })
      .render("#paypal-express");
  }

  shouldComponentUpdate = (nextProps: Props, nextState: State) => {
    this.oldContext = this.context;
    return true;
  };

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    // Listening for context changes
    if (!isEqual(this.oldContext, this.context)) {
      const oldDefaultShipping = get(
        this.oldContext,
        "customer.default_shipping"
      );
      const newDefaultShipping = get(this.context, "customer.default_shipping");
      const oldCartShippingAddress = get(
        this.oldContext,
        "cart.shipping_addresses[0]",
        {}
      );
      const newCartShippingAddress = get(
        this.context,
        "cart.shipping_addresses[0]",
        {}
      );
      const defaultShippingChanged =
        oldDefaultShipping !== newDefaultShipping && !!newDefaultShipping;
      const cartShippingAddressChanged = !isEqual(
        oldCartShippingAddress,
        newCartShippingAddress
      );
      if (defaultShippingChanged || cartShippingAddressChanged) {
        this.setState({
          selectedShippingAddressId: this.getDefaultSelectedShippingAddressId(),
        });
      }
    }
  };

  createPaypalToken = async () => {
    const CreatePaypalTokenMutation = `
      mutation createPaypalExpressToken($input: PaypalExpressTokenInput!) {
        createPaypalExpressToken(input: $input) {
          token
          paypal_urls {
            edit
            start
          }
        }
      }
    `;
    const variables = {
      input: {
        cart_id: this.context.cart.id,
        code: "paypal_express",
        express_button: true,
        urls: {
          cancel_url: "checkout/information/paypal-cancelled",
          return_url: "checkout/information/paypal-success",
        },
      },
    };

    // Request Paypal Express Token from Magento and pass it to the Paypal SDK
    const response = await graphqlRequest(
      this.context,
      CreatePaypalTokenMutation,
      variables
    );
    console.log(response);
    return response["createPaypalExpressToken"]["token"];
  };

  handlePaypalTransactionApprove = async (data, actions) => {
    console.log("DATA", data);
    // Get order details from Paypal
    // It contains info about the customer and the selected shipping address
    const order = await actions.order.get(data.orderID);
    console.log("ORDER", order);

    // Extract customer + shipping address info from order
    const shippingAddress = get(
      order,
      "purchase_units[0].shipping.address",
      {}
    );
    const shippingContact = get(
      order,
      "purchase_units[0].shipping.name.full_name",
      ""
    );
    const customer = get(order, "payer");
    const [shippingFirstName, shippingLastName] = shippingContact.split(" ");

    this.setState(
      {
        ...this.state,
        // Pre-fill the Create Account form with customer info
        createAccount: {
          ...this.state.createAccount,
          firstname: customer.name.given_name,
          lastname: customer.name.surname,
          email: customer.email_address,
        },
        // Pre-fill shipping address form with extracted info
        shippingAddress: {
          ...this.state.shippingAddress,
          firstName: shippingFirstName,
          lastName: shippingLastName,
          city: shippingAddress.admin_area_2,
          region: shippingAddress.admin_area_1,
          address: shippingAddress.address_line_1,
          aptNumber: shippingAddress.address_line_2 || "",
          zipCode: shippingAddress.postal_code,
        },
        // Save paypal tokens so we can set the payment method on submit
        paypalExpressInfo: {
          token: data.orderID,
          payer_id: data.payerID,
        },
      },
      () => {
        // Update shipping address form after setting state
        console.log("NEW STATE", this.state);
        this.validateContactInfo();
        this.shippingAddressForm.updateValues(this.state.shippingAddress, true);
      }
    );
  };

  renderExpressCheckoutSection = () => {
    return (
      <React.Fragment>
        <div className={styles.section}>
          <h3 className={styles.expressCheckoutSubtitle}>Express Checkout</h3>
          <div className={styles.expressCheckoutOptions}>
            <div id="paypal-express" className={styles.expressCheckoutOption} />
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

  validateContactInfoField = (fieldName: string) => {
    try {
      contactInfoSchema.validateSyncAt(fieldName, this.state.createAccount, {
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
    const name = `${this.context.customer.firstname} ${this.context.customer.lastname}`;
    return (
      <div className={cn(styles.contactInfoSection, styles.section)}>
        <h3 className={styles.contactInfoTitle}>Contact Info</h3>
        <div className={cn(styles.loggedIn, styles.loginHint)}>
          Logged in as&nbsp;
          <span className={styles.loggedInName}>{name}</span>
        </div>
        <span
          className={cn(styles.logOut, styles.loginLink)}
          onClick={() => {
            this.context.logout();
          }}
        >
          Log Out
        </span>
        <div className={styles.userName}>{name}</div>
        <div className={styles.userEmail}>{this.context.customer?.email}</div>
        {(this.context.customerLoading || this.state.isSubmitting) && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
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
            <span
              className={styles.loginLink}
              onClick={() => {
                // Hardcoded for now, so we don't create a ton of accounts unless we want to test the register
                this.context.login("test@example.com", "StrongPassword1");
              }}
            >
              Log In
            </span>
          </div>
        </div>
        <div className={styles.createAccountSection}>
          <Input
            className={styles.firstName}
            placeholder="First Name"
            value={this.state.createAccount.firstname}
            onChange={(val: string) => {
              this.updateField("firstname", val);
            }}
            onBlur={() => this.validateContactInfoField("firstname")}
            error={this.state.createAccountErrors.firstname}
          />
          <Input
            className={styles.lastName}
            placeholder="Last Name"
            value={this.state.createAccount.lastname}
            onChange={(val: string) => {
              this.updateField("lastname", val);
            }}
            onBlur={() => this.validateContactInfoField("lastname")}
            error={this.state.createAccountErrors.lastname}
          />
          <Input
            className={styles.email}
            placeholder="Email Address"
            value={this.state.createAccount.email}
            onChange={(val: string) => {
              this.updateField("email", val);
            }}
            onBlur={() => this.validateContactInfoField("email")}
            error={this.state.createAccountErrors.email}
          />
          <Input
            className={styles.password}
            placeholder="Create Password"
            type="password"
            value={this.state.createAccount.password}
            onChange={(val: string) => {
              this.updateField("password", val);
            }}
            onBlur={() => this.validateContactInfoField("password")}
            error={this.state.createAccountErrors.password}
          />
          <Input
            className={styles.confirmPassword}
            placeholder="Re-Enter Password"
            type="password"
            value={this.state.createAccount.confirmPassword}
            onChange={(val: string) => {
              this.updateField("confirmPassword", val);
            }}
            onBlur={() => this.validateContactInfoField("confirmPassword")}
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
    const existingAddresses = this.context.customer?.addresses || [];
    return (
      <div className={cn(styles.section, styles.shippingAddressSection)}>
        <h3 className={styles.sectionTitle}>Shipping Address</h3>

        {this.context.isLoggedIn &&
          existingAddresses.length > 0 &&
          existingAddresses.map((address) => {
            const contactName = `${address.firstname} ${address.lastname}`;
            const street = address.street.join(" ");
            const cityState = `${address.city}, ${address.region.region_code}, ${address.postcode}`;
            return (
              <div
                className={cn("row margin-top clickable")}
                key={`address_${address.id}`}
                onClick={() => {
                  this.setState({
                    selectedShippingAddressId: address.id,
                  });
                }}
              >
                <RadioButton
                  className={styles.radioButton}
                  value={this.state.selectedShippingAddressId}
                  option={address.id}
                />
                <div>
                  <div className={styles.addressLine}>{contactName}</div>
                  <div className={styles.addressLine}>{street}</div>
                  <div className={styles.addressLine}>{cityState}</div>
                </div>
              </div>
            );
          })}
        {this.context.isLoggedIn && (
          <div
            className={cn("row margin-top clickable")}
            onClick={() => {
              this.setState({
                selectedShippingAddressId: -1,
              });
            }}
          >
            <RadioButton
              className={styles.radioButton}
              value={this.state.selectedShippingAddressId}
              option={-1}
            />
            <div className={styles.addressLine}>
              Use a different shipping address
            </div>
          </div>
        )}
        <AddressForm
          visible={
            this.state.selectedShippingAddressId === -1 ||
            !this.context.isLoggedIn
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
        {(this.context.customerLoading || this.state.isSubmitting) && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  };

  async onSubmit() {
    this.setState({ isSubmitting: true });
    if (!this.context.isLoggedIn) {
      const createCustomerInput = new CreateCustomerInput(
        this.state.createAccount
      );
      await this.context.createCustomer(createCustomerInput);
      await this.context.mergeGuestCart();
    }

    let addressId = this.state.selectedShippingAddressId;
    if (addressId === -1) {
      const address = await this.createCustomerAddress();
      addressId = address.id;
    }
    await this.context.setShippingAddress(addressId);

    if (this.state.paypalExpressInfo.payer_id) {
      // If we are going through paypal express, set the payment method as well,
      // place the order and go to the confirmation page

      // If paypal, set the billing to be same as shipping
      await this.context.setBillingAddress(true);

      await this.context.setShippingMethod();

      const paymentMethodResponse = await this.context.setPaymentMethod({
        cart_id: this.context.cart.id,
        payment_method: {
          code: "paypal_express",
          paypal_express: {
            payer_id: this.state.paypalExpressInfo.payer_id,
            token: this.state.paypalExpressInfo.token,
          },
        },
      });

      this.context.setSelectedPaymentOption(PaymentOption.PayPal);
      console.log("PAYMENT METHOD", paymentMethodResponse);

      await this.context.placeOrder();
      this.setState({ isSubmitting: false });
      this.props.history.push(ORDER_CONFIRMATION_URL);
      return;
    }
    // Show server errors if needed
    this.setState({ isSubmitting: false });
    this.props.history.push(PAYMENT_URL);
  }

  async createCustomerAddress() {
    const addressInput = new CustomerAddressInput(this.state.shippingAddress);
    return await this.context.createCustomerAddress(addressInput);
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
          {this.context.isLoggedIn && this.renderContactInfoSection()}
          {!this.context.isLoggedIn && this.renderCreateAccountSection()}
          {this.renderShippingMethodSection()}
          {this.renderShippingAddressSection()}

          {isOnMobile() && <div className={cn("horizontal-divider")} />}

          <div className={styles.navigationContainer}>
            <Link
              to={MAIN_SHOP_URL} // TODO: Update this to CART_URL
              className={cn("link-button", { "margin-top": isOnMobile() })}
            >
              <i className="far fa-long-arrow-left" />
              Return to cart
            </Link>
            <button
              className={cn("button large", { "margin-top": isOnMobile() })}
              onClick={() => this.onSubmit()}
              disabled={
                (!this.context.isLoggedIn &&
                  !contactInfoSchema.isValidSync(this.state.createAccount)) ||
                (this.state.selectedShippingAddressId === -1 &&
                  this.shippingAddressForm &&
                  !this.shippingAddressForm.isValid())
              }
            >
              {this.state.paypalExpressInfo.payer_id
                ? "Place My Order"
                : "Continue to Payment"}
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
