import { ORDER_ID_STORAGE_KEY, PASSWORD_REGEX } from "constants/general";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PersonalInformation.module.scss";
import cn from "classnames";
import { ORDER_CONFIRMATION_URL, PAYMENT_URL } from "constants/urls";
import Input from "components/common/Input/Input";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import AddressForm, {
  AddressFormValuesT,
  DEFAULT_ADDRESS_FORM_VALUES,
} from "components/common/Forms/AddressForm/AddressForm";
import { isOnMobile } from "utils/responsive";
import RadioButton from "components/common/RadioButton/RadioButton";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../context/AppContext";
import { get, isEqual } from "lodash-es";
import {
  CreateCustomerInput,
  CustomerAddressInput,
} from "context/CustomerAPI/models";
import { parsePhoneNumber, scrollToTop } from "utils/general";
import Loader from "components/common/Loader/Loader";
import { PaymentOption } from "../PaymentInformation/PaymentInformation";
import ButtonLoader from "components/common/ButtonLoader/ButtonLoader";
import { RESTRequest } from "RestClient";
import { getAddressId } from "utils/context";
import CreditCardForm from "components/common/Forms/CreditCardForm/CreditCardForm";
import Checkbox from "components/common/Checkbox/Checkbox";
import PaypalExpress from "./PaypalExpress/PaypalExpress";
import StripePaymentButtons from "./StripePaymentButtons/StripePaymentButtons";

const contactInfoSchema = yup.object().shape({
  firstname: yup.string().required("Required"),
  lastname: yup.string().required("Required"),
  email: yup.string().email().required("Required"),
  password: yup
    .string()
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 characters and contain an uppercase letter, a lowercase one and a special character"
    )
    .required("Required"),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("password")], "Passwords don't match"),
});

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
  billingAddress: AddressFormValuesT;
  paypalExpressInfo: {
    token: string;
    payer_id: string;
  };
  stripePaymentMethodId: string;
  isSubmitting: boolean;
  billingSameAsShipping: boolean;
};

export class PersonalInformation extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  shippingAddressForm?: AddressForm;
  billingAddressForm?: AddressForm;

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
      billingAddress: DEFAULT_ADDRESS_FORM_VALUES,
      paypalExpressInfo: {
        token: "",
        payer_id: "",
      },
      stripePaymentMethodId: "",
      isSubmitting: false,
      billingSameAsShipping: true,
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

  componentDidMount() {
    scrollToTop();
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

  renderExpressCheckoutSection = () => {
    if (!this.context.cart.items || this.context.cart.items.length === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <div className={styles.expressCheckoutOptions}>
          <StripePaymentButtons
            className={styles.expressCheckoutOption}
            onTransactionApproved={this.handleTransactionApproved}
          />
          <PaypalExpress
            className={styles.expressCheckoutOption}
            onTransactionApproved={this.handleTransactionApproved}
          />
        </div>
        <div className={styles.payWithCard}>
          <div className={styles.text}>Or pay with card</div>
        </div>
      </React.Fragment>
    );
  };

  handleTransactionApproved = (transactionData: Object) => {
    let tokenInfo;
    if (transactionData.paypalExpressInfo) {
      tokenInfo = transactionData.paypalExpressInfo;
    } else if (transactionData.stripePaymentMethodId) {
      tokenInfo = {
        stripePaymentMethodId: transactionData.stripePaymentMethodId,
      };
    }

    if (!tokenInfo) {
      console.error("Did not receive payment tokens!");
      return;
    }

    const customerFields = transactionData.customer;
    const shippingAddressFields = transactionData.shippingAddress;

    if (!this.context.isLoggedIn) {
      this.setState(
        {
          ...this.state,
          ...tokenInfo,
          createAccount: {
            ...this.state.createAccount,
            ...customerFields,
          },
        },
        () => {
          this.validateContactInfo();
          this.shippingAddressForm.updateValues(
            {
              ...this.state.shippingAddress,
              ...shippingAddressFields,
            },
            true
          );
        }
      );
    }
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
        {this.context.customerLoading && (
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
          <h3 className={styles.sectionTitle}>Your information</h3>
          <div>
            <span className={styles.loginHint}>Have an account?</span>
            <span
              className={styles.loginLink}
              onClick={() => {
                this.context.openModal(Modals.Login);
              }}
            >
              Log In
            </span>
          </div>
        </div>
        <div className={styles.createAccountSection}>
          <div className={styles.inputLabel}>First Name</div>
          <Input
            className={styles.firstName}
            placeholder="John"
            value={this.state.createAccount.firstname}
            onChange={(val: string) => {
              this.updateField("firstname", val);
            }}
            onBlur={() => this.validateContactInfoField("firstname")}
            error={this.state.createAccountErrors.firstname}
          />
          <div className={styles.inputLabel}>Last Name</div>
          <Input
            className={styles.lastName}
            placeholder="Doe"
            value={this.state.createAccount.lastname}
            onChange={(val: string) => {
              this.updateField("lastname", val);
            }}
            onBlur={() => this.validateContactInfoField("lastname")}
            error={this.state.createAccountErrors.lastname}
          />
          <div className={styles.inputLabel}>Email Address</div>
          <Input
            className={styles.email}
            placeholder="example@gmail.com"
            value={this.state.createAccount.email}
            onChange={(val: string) => {
              this.updateField("email", val);
            }}
            onBlur={() => this.validateContactInfoField("email")}
            error={this.state.createAccountErrors.email}
          />
          <div className={styles.inputLabel}>Password</div>
          <Input
            className={styles.password}
            type="password"
            value={this.state.createAccount.password}
            onChange={(val: string) => {
              this.updateField("password", val);
            }}
            onBlur={() => this.validateContactInfoField("password")}
            error={this.state.createAccountErrors.password}
          />
          <div className={styles.inputLabel}>Confirm Password</div>
          <Input
            className={styles.confirmPassword}
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
          withAutocomplete
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
        {this.context.customerLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  };

  renderPaymentInformationSection = () => {
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Payment Information</h3>
        <CreditCardForm
          useStripe
          visible
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
        <div
          className={styles.billingOption}
          onClick={() => {
            this.setState({
              billingSameAsShipping: !this.state.billingSameAsShipping,
            });
          }}
        >
          <Checkbox
            className={styles.checkbox}
            value={this.state.billingSameAsShipping}
          />
          <span className={styles.text}>
            Billing address is the same as shipping
          </span>
        </div>
      </div>
    );
  };

  renderBillingAddress = () => {
    return (
      <AddressForm
        withAutocomplete
        listClassName={
          !this.state.billingSameAsShipping ? styles.billingAddress : undefined
        }
        visible={!this.state.billingSameAsShipping}
        onChange={(newValues: AddressFormValuesT) => {
          this.setState({
            billingAddress: newValues,
          });
        }}
        componentRef={(ref) => {
          this.billingAddressForm = ref;
        }}
      />
    );
  };

  renderCurrency = (value?: number, def?: string) => {
    if (!value) {
      return def;
    }
    return `$${value}`;
  };

  renderTotals = () => {
    return (
      <div className={styles.totalsContainer}>
        <div className={styles.totalLine}>
          <div className={styles.label}>Subtotal</div>
          <div className={styles.value}>
            {this.renderCurrency(
              get(this.context.cart, "prices.subtotal_excluding_tax.value"),
              "-"
            )}
          </div>
        </div>
        <div className={styles.totalLine}>
          <div className={styles.label}>Shipping</div>
          <div className={styles.value}>
            {this.renderCurrency(
              get(
                this.context.cart,
                "shipping_addresses[0].selected_shipping_method.amount.value"
              ),
              "-"
            )}
          </div>
        </div>
        <div className={styles.totalLine}>
          <div className={styles.label}>
            Estimated tax{" "}
            {this.state.shippingAddress.zipCode
              ? ` for ${this.state.shippingAddress.zipCode}`
              : ``}
          </div>
          <div className={styles.value}>
            {this.renderCurrency(
              get(this.context.cart, "selected_shipping_method.amount.value"),
              "-"
            )}
          </div>
        </div>
        <div className={styles.grandTotalLine}>
          <div className={styles.label}>Total</div>
          <div className={styles.value}>
            {this.renderCurrency(
              get(this.context.cart, "prices.grand_total.value"),
              "-"
            )}
          </div>
        </div>
      </div>
    );
  };

  placeOrderWithPaypal = async () => {
    // If paypal, set the billing to be same as shipping
    this.setState({
      isSubmitting: true,
    });
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
  };

  placeOrderWithStripe = async () => {
    this.setState({
      isSubmitting: true,
    });
    await this.context.setBillingAddress(true);
    await this.context.setShippingMethod();

    const response = await RESTRequest(
      "POST",
      "carts/mine/payment-information",
      {
        paymentMethod: {
          method: "stripe_payments",
          additional_data: {
            cc_save: false,
            cc_stripejs_token: this.state.stripePaymentMethodId,
          },
        },
      }
    );
    const respBody = await response.json();
    if (response.ok && respBody) {
      sessionStorage.setItem(ORDER_ID_STORAGE_KEY, respBody);
      this.props.history.push(ORDER_CONFIRMATION_URL);
      return;
    }
  };

  onSubmit = async () => {
    this.setState({ isSubmitting: true });
    try {
      if (!this.context.isLoggedIn) {
        const createCustomerInput = new CreateCustomerInput(
          this.state.createAccount
        );

        await this.context.createCustomer(createCustomerInput);
      }

      let addressId = this.state.selectedShippingAddressId;
      if (addressId === -1) {
        const address = await this.createCustomerAddress();
        addressId = address.id;
      }
      await this.context.setShippingAddress(addressId);
      await this.context.setShippingMethod();

      if (this.state.paypalExpressInfo.payer_id) {
        // If we are going through paypal express, set the payment method as well,
        // place the order and go to the confirmation page

        await this.placeOrderWithPaypal();
        return;
      }

      if (this.state.stripePaymentMethodId) {
        await this.placeOrderWithStripe();
        return;
      }

      this.setState({ isSubmitting: false });
      this.props.history.push(PAYMENT_URL);
    } catch (e) {
      if (e.graphqlErrors) {
        for (const err of e.graphqlErrors) {
          if (
            err.message.includes(
              "A customer with the same email address already exists"
            )
          ) {
            this.setState({
              createAccountErrors: {
                ...this.state.createAccountErrors,
                email: "A user with the same email address already exists",
              },
            });
            return;
          }
        }
      }
    } finally {
      this.setState({
        isSubmitting: false,
      });
    }
  };

  createCustomerAddress = async (addressFields?: any) => {
    const addressInput = new CustomerAddressInput(
      addressFields || this.state.shippingAddress
    );
    return await this.context.createCustomerAddress(addressInput);
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PersonalInformation)}>
        <div className={styles.informationContainer}>
          {this.renderExpressCheckoutSection()}
          {this.context.isLoggedIn && this.renderContactInfoSection()}
          {!this.context.isLoggedIn && this.renderCreateAccountSection()}
          {this.renderShippingAddressSection()}
          {this.renderPaymentInformationSection()}
          {this.renderBillingAddress()}
          {this.renderTotals()}
          <div className={styles.navigationContainer}>
            <button
              className={styles.payButton}
              onClick={() => this.onSubmit()}
              disabled={
                this.state.isSubmitting ||
                (!this.context.isLoggedIn &&
                  !contactInfoSchema.isValidSync(this.state.createAccount)) ||
                (this.state.selectedShippingAddressId === -1 &&
                  this.shippingAddressForm &&
                  !this.shippingAddressForm.isValid())
              }
            >
              {`Pay ${this.renderCurrency(
                get(this.context.cart, "prices.grand_total.value"),
                "-"
              )}`}
              {this.state.isSubmitting && <ButtonLoader />}
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
