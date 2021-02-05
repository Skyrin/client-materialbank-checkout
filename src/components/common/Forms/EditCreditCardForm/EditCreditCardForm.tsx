import styles from "./EditCreditCardForm.module.scss";
import * as React from "react";
import cn from "classnames";
import Input from "components/common/Input/Input";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import {
  cardNumberInputFormatter,
  cardNumberInputParser,
  digitsOnlyInputParser,
  expirationDateInputFormatter,
  expirationDateInputParser,
} from "components/common/Input/utils";

const editCreditCardSchema = yup.object().shape({
  creditCardNumber: yup.string().required("Required"),
  creditCardName: yup.string().required("Required"),
  cardDate: yup
    .string()
    .required("Required")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid date"),
  cardCVV: yup
    .string()
    .required("Required")
    .matches(/^[0-9]{3,4}$/, "Invalid CVV"),
});

export const DEFAULT_CREDIT_CARD_FORM_VALUES: CreditCardFormValuesT = {
  id: null,
  creditCardNumber: "",
  creditCardName: "",
  cardDate: "",
  cardCVV: "",
};

export type CreditCardFormValuesT = {
  id: string;
  creditCardNumber: string;
  creditCardName: string;
  cardDate: string;
  cardCVV: string;
};

type CreditCardFormErrorsT = {
  creditCardNumber: string | null;
  creditCardName: string | null;
  cardDate: string | null;
  cardCVV: string | null;
};

type Props = {
  initialValues?: CreditCardFormValuesT;
  componentRef?: (ref: EditCreditCardForm) => void;
  onSave?: (creditCardValues: CreditCardFormValuesT) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
  visible?: boolean;
};

type State = {
  values: CreditCardFormValuesT;
  errors: CreditCardFormErrorsT;
  editMode: boolean;
};

export default class EditCreditCardForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      values: props.initialValues || DEFAULT_CREDIT_CARD_FORM_VALUES,
      editMode: !!this.props.initialValues,
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

  render() {
    return (
      <div
        className={cn(styles.EditCreditCardForm, {
          [styles.visible]: this.props.visible === true,
        })}
      >
        <div className={styles.title}>
          {this.state.editMode ? "Edit this Card" : "Add a New Card"}
        </div>
        <div className={styles.form}>
          <div className={styles.cardNumber}>
            <div className={styles.inputHint}>Card Number</div>
            <Input
              placeholder="xxxx xxxx xxxx xxxx"
              formatter={cardNumberInputFormatter}
              parser={cardNumberInputParser}
              value={this.state.values.creditCardNumber}
              error={this.state.errors.creditCardNumber}
              onChange={(val: string) => {
                this.updateFieldForm("creditCardNumber", val);
              }}
            />
          </div>

          <div className={styles.cardName}>
            <div className={styles.inputHint}>Name on Card</div>
            <Input
              placeholder="First M. Last"
              value={this.state.values.creditCardName}
              error={this.state.errors.creditCardName}
              onChange={(val: string) => {
                this.updateFieldForm("creditCardName", val);
              }}
            />
          </div>

          <div className={styles.cardExpiration}>
            <div className={styles.inputHint}>Expiration</div>
            <Input
              placeholder="MM / YY"
              value={this.state.values.cardDate}
              error={this.state.errors.cardDate}
              formatter={expirationDateInputFormatter}
              parser={expirationDateInputParser}
              inputMode="numeric"
              onChange={(val: string) => {
                this.updateFieldForm("cardDate", val);
              }}
            />
          </div>

          <div className={styles.cardCvv}>
            <div className={styles.inputHint}>CVV</div>
            <Input
              placeholder="xxx"
              value={this.state.values.cardCVV}
              error={this.state.errors.cardCVV}
              parser={digitsOnlyInputParser}
              inputMode="numeric"
              onChange={(val: string) => {
                this.updateFieldForm("cardCVV", val);
              }}
            />
          </div>
        </div>
        <div className={styles.buttons}>
          {this.state.editMode && (
            <button
              className={styles.deleteButton}
              onClick={() => this.props.onDelete(this.state.values.id)}
            >
              DELETE THIS CARD
            </button>
          )}
          <button className={styles.cancelButton} onClick={this.cancelClick}>
            Cancel
          </button>
          <button className={styles.saveChanges} onClick={this.saveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  saveChanges = () => {
    if (this.validateCreditCard()) {
      this.props.onSave(this.state.values);
    }
  };

  cancelClick = () => {
    this.resetForm();
    this.props.onCancel(this.state.values.id);
  };

  resetForm = () => {
    this.setState({
      values: this.props.initialValues || DEFAULT_CREDIT_CARD_FORM_VALUES,
    });
  };

  updateFieldForm = (fieldName: string, value: string) => {
    this.setState({
      values: {
        ...this.state.values,
        [fieldName]: value,
      },
      errors: {
        ...this.state.errors,
        [fieldName]: null,
      },
    });
  };

  validateCreditCard = () => {
    try {
      editCreditCardSchema.validateSync(this.state.values, {
        abortEarly: false,
      });
      return true;
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        errors: {
          ...this.state.errors,
          ...errors,
        },
      });
      return false;
    }
  };
}
