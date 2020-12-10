import Input from "components/common/Input/Input";
import {
  cardNumberInputFormatter,
  cardNumberInputParser,
  digitsOnlyInputParser,
  expirationDateInputFormatter,
  expirationDateInputParser,
} from "components/common/Input/utils";
import * as React from "react";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import styles from "./CreditCardForm.module.scss";
import cn from "classnames";

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
  creditCardNumber: yup.string().required(),
  creditCardName: yup.string().required(),
  cardDate: yup.string().required(),
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
};

type State = {
  values: CreditCardFormValuesT;
  errors: CreditCardFormErrorsT;
};

export default class CreditCardForm extends React.Component<Props, State> {
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
    };

    if (props.componentRef) {
      // Can be used to call functions from outside the component.
      // i.e. triggering a full validation, or checking status of validations.
      props.componentRef(this);
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

  render() {
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
          formatter={cardNumberInputFormatter}
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
          formatter={expirationDateInputFormatter}
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
          placeholder="Normal text input"
        />
      </div>
    );
  }
}
