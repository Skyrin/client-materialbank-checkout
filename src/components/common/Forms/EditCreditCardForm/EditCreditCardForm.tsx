import styles from "./EditCreditCardForm.module.scss";
import * as React from "react";
import cn from "classnames";
import Input from "components/common/Input/Input";
import * as yup from "yup";
import { extractErrors } from "utils/forms";

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
          <button className={styles.saveChanges} onClick={this.saveChanged}>
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  saveChanged = () => {
    if (this.validateCreditCard()) {
      this.props.onSave(this.state.values);
    }
  };

  cancelClick = () => {
    if (!this.state.editMode) {
      this.setState({
        values: DEFAULT_CREDIT_CARD_FORM_VALUES,
      });
    }
    this.props.onCancel(this.state.values.id);
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
