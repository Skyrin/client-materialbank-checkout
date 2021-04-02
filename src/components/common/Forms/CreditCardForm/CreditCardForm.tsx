import Input from "components/common/Input/Input";
import {
  // cardNumberInputFormatter,
  cardNumberInputParser,
  digitsOnlyInputParser,
  // expirationDateInputFormatter,
  expirationDateInputParser,
} from "components/common/Input/utils";
import * as React from "react";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import styles from "./CreditCardForm.module.scss";
import cn from "classnames";
import {
  Stripe,
  StripeElements,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  loadStripe,
} from "@stripe/stripe-js";
import { isOnMobile } from "utils/responsive";

export type CreditCardFormValuesT = {
  creditCardNumber: string;
  creditCardName: string;
  cardDate: string;
  cardCVV: string;
};

export const DEFAULT_CREDIT_CARD_FORM_VALUES: CreditCardFormValuesT = {
  creditCardNumber: "",
  creditCardName: "",
  cardDate: "",
  cardCVV: "",
};

const DEFAULT_FORM_SCHEMA = yup.object().shape({
  creditCardNumber: yup.string().required("Required"),
  creditCardName: yup.string().required("Required"),
  cardDate: yup.string().required("Required"),
  cardCVV: yup
    .string()
    .matches(/[0-9]+/, "Digits Only")
    .required(),
});

type CreditCardFormErrorsT = {
  creditCardNumber: string | null;
  creditCardName: string | null;
  cardDate: string | null;
  cardCVV: string | null;
};

type Props = {
  initialValues?: CreditCardFormValuesT;
  validationSchema?: any;
  onChange: (newValues: CreditCardFormValuesT) => void;
  componentRef?: (ref: CreditCardForm) => void;
  listClassName?: string;
  inputClassName?: string;
  visible?: boolean;
  useStripe?: boolean;
};

type State = {
  values: CreditCardFormValuesT;
  errors: CreditCardFormErrorsT;
  stripeNumberComplete: boolean;
  stripeExpiryComplete: boolean;
  stripeCVCComplete: boolean;
};

export default class CreditCardForm extends React.Component<Props, State> {
  stripe: Stripe;
  elements: StripeElements;
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  cardCVC: StripeCardCvcElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      values: props.initialValues || DEFAULT_CREDIT_CARD_FORM_VALUES,
      errors: {
        creditCardNumber: null,
        creditCardName: null,
        cardDate: null,
        cardCVV: null,
      },
      stripeNumberComplete: false,
      stripeExpiryComplete: false,
      stripeCVCComplete: false,
    };

    if (props.componentRef) {
      // Can be used to call functions from outside the component.
      // i.e. triggering a full validation, or checking status of validations.
      props.componentRef(this);
    }
  }

  async componentDidMount() {
    if (this.props.useStripe) {
      this.stripe = await loadStripe(
        "pk_test_51I1F3fCnVrIUZxgWfN53yuaDE2trsJ1rFx7g1Nj44m3SMaCdKPuK1q7fm2IaBMnk0pB2lJsy4q0b2EP1NgiUcUaS00wwKh2Q54"
      );
      this.elements = this.stripe.elements({
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
          },
        ],
      });

      const defaultStyle = {
        fontSize: isOnMobile() ? "12px" : "14px",
        fontSmoothing: "antialiased",
        lineHeight: isOnMobile() ? "1.5" : undefined,
      };

      this.cardNumber = this.elements.create("cardNumber", {
        classes: {
          base: cn(styles.cardNumberArea, styles.input),
          invalid: styles.hasError,
        },
        style: { base: defaultStyle },
        placeholder: "4111 1111 1111 1111",
        showIcon: true,
      });
      this.cardNumber.mount("#stripe-card-number");
      this.cardExpiry = this.elements.create("cardExpiry", {
        classes: {
          base: cn(styles.expirationArea, styles.input),
          invalid: styles.hasError,
        },
        style: { base: defaultStyle },
        placeholder: "MM / YY",
      });
      this.cardExpiry.mount("#stripe-card-expiration");
      this.cardCVC = this.elements.create("cardCvc", {
        classes: {
          base: cn(styles.cvvArea, styles.input),
          invalid: styles.hasError,
        },
        style: { base: defaultStyle },
        placeholder: "123",
      });
      this.cardCVC.mount("#stripe-card-cvc");

      this.cardNumber.on("change", (e) => {
        this.setState({ stripeNumberComplete: e.complete }, () => {
          if (
            this.state.stripeCVCComplete &&
            this.state.stripeExpiryComplete &&
            this.state.stripeNumberComplete &&
            this.state.values.creditCardName
          ) {
            this.props.onChange(this.state.values);
          }
        });
      });
      this.cardExpiry.on("change", (e) => {
        this.setState({ stripeExpiryComplete: e.complete }, () => {
          if (
            this.state.stripeCVCComplete &&
            this.state.stripeExpiryComplete &&
            this.state.stripeNumberComplete &&
            this.state.values.creditCardName
          ) {
            this.props.onChange(this.state.values);
          }
        });
      });
      this.cardCVC.on("change", (e) => {
        this.setState({ stripeCVCComplete: e.complete }, () => {
          if (
            this.state.stripeCVCComplete &&
            this.state.stripeExpiryComplete &&
            this.state.stripeNumberComplete &&
            this.state.values.creditCardName
          ) {
            this.props.onChange(this.state.values);
          }
        });
      });
    }
  }

  updateField = (fieldName: string, value: string) => {
    this.setState(
      {
        values: {
          ...this.state.values,
          [fieldName]: value,
        },
        errors: {
          ...this.state.errors,
          [fieldName]: null,
        },
      },
      () => {
        this.props.onChange(this.state.values);
      }
    );
  };

  processErrors = (e: any) => {
    const errors = extractErrors(e);
    this.setState({
      errors: {
        ...this.state.errors,
        ...errors,
      },
    });
  };

  validateForm = () => {
    try {
      if (this.props.useStripe) {
        this.validateField("creditCardName");
        return;
      }
      const schema = this.getSchema();
      schema.validateSync(this.state.values, {
        abortEarly: false,
      });
    } catch (e) {
      this.processErrors(e);
    }
  };

  getSchema = () => {
    return this.props.validationSchema || DEFAULT_FORM_SCHEMA;
  };

  isValid = () => {
    const schema = this.getSchema();
    if (this.props.useStripe) {
      const nameOnCard = yup
        .reach(schema, "creditCardName", undefined, undefined)
        .isValidSync(this.state.values.creditCardName);
      return (
        nameOnCard &&
        this.state.stripeNumberComplete &&
        this.state.stripeExpiryComplete &&
        this.state.stripeCVCComplete
      );
    }
    return schema.isValidSync(this.state.values);
  };

  validateField = (fieldName: string) => {
    try {
      const schema = this.getSchema();
      schema.validateSyncAt(fieldName, this.state.values, {
        abortEarly: false,
      });
    } catch (e) {
      this.processErrors(e);
    }
  };

  createStripePaymentMethod = async () => {
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: "card",
      card: this.cardNumber,
      billing_details: {
        name: this.state.values.creditCardName,
      },
    });
    console.log(paymentMethod);
    console.log(error);
    return paymentMethod;
  };

  renderStripe = () => {
    return (
      <div
        id="stripe-card"
        className={cn(styles.creditCardArea, this.props.listClassName, {
          [styles.visible]: this.props.visible === true,
        })}
      >
        <div className={styles.inputLabel}>Name on Card</div>
        <Input
          className={styles.cardNameArea}
          value={this.state.values.creditCardName}
          onChange={(val: string) => {
            this.updateField("creditCardName", val);
          }}
          onBlur={() => {
            this.validateField("creditCardName");
          }}
          error={this.state.errors.creditCardName}
          placeholder="John Doe"
        />
        <div className={styles.inputLabel}>Card Number</div>
        <div id="stripe-card-number" />
        {isOnMobile() ? (
          <React.Fragment>
            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <div className={styles.inputLabel}>Expiration</div>
                <div id="stripe-card-expiration" />
              </div>
              <div className={styles.inputCol}>
                <div className={styles.inputLabel}>CVV</div>
                <div id="stripe-card-cvc" />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className={styles.inputLabel}>Expiration</div>
            <div id="stripe-card-expiration" />
            <div className={styles.inputLabel}>CVV</div>
            <div id="stripe-card-cvc" />
          </React.Fragment>
        )}
      </div>
    );
  };

  render() {
    if (this.props.useStripe) {
      return this.renderStripe();
    }

    return (
      <div
        className={cn(styles.creditCardArea, this.props.listClassName, {
          [styles.visible]: this.props.visible === true,
        })}
      >
        <Input
          className={styles.cardNumberArea}
          value={this.state.values.creditCardNumber}
          onChange={(val: string) => {
            this.updateField("creditCardNumber", val);
          }}
          onBlur={() => {
            this.validateField("creditCardNumber");
          }}
          // formatter={cardNumberInputFormatter}
          parser={cardNumberInputParser}
          error={this.state.errors.creditCardNumber}
          placeholder="Card Number"
          inputMode="numeric"
        />
        <Input
          className={styles.expirationArea}
          value={this.state.values.cardDate}
          onChange={(val: string) => {
            this.updateField("cardDate", val);
          }}
          onBlur={() => {
            this.validateField("cardDate");
          }}
          // formatter={expirationDateInputFormatter}
          parser={expirationDateInputParser}
          error={this.state.errors.cardDate}
          placeholder="Expiration (MM/YR)"
          inputMode="numeric"
        />
        <Input
          className={styles.cvvArea}
          value={this.state.values.cardCVV}
          onChange={(val: string) => {
            this.updateField("cardCVV", val);
          }}
          onBlur={() => {
            this.validateField("cardCVV");
          }}
          parser={digitsOnlyInputParser}
          error={this.state.errors.cardCVV}
          placeholder="CVV"
          inputMode="numeric"
        />
        <Input
          className={styles.cardNameArea}
          value={this.state.values.creditCardName}
          onChange={(val: string) => {
            this.updateField("creditCardName", val);
          }}
          onBlur={() => {
            this.validateField("creditCardName");
          }}
          error={this.state.errors.creditCardName}
          placeholder="Name On Card"
        />
      </div>
    );
  }
}
