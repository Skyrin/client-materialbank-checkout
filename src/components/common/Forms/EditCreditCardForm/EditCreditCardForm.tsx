import styles from "./EditCreditCardForm.module.scss";
import * as React from "react";
import cn from "classnames";
import CreditCardForm from "../CreditCardForm/CreditCardForm";

export const DEFAULT_CREDIT_CARD_FORM_VALUES: CreditCardFormValuesT = {
  id: null,
  creditCardNumber: "",
  creditCardName: "",
  cardDate: "",
  cardCVV: "",
  isDefault: false,
};

export type CreditCardFormValuesT = {
  id: string;
  creditCardNumber?: string;
  creditCardName?: string;
  cardDate?: string;
  cardCVV?: string;
  expires?: string;
  token?: string;
  last4?: string;
  isDefault: boolean;
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
  onSetDefault?: (id: string) => void;
  visible?: boolean;
};

type State = {
  values: CreditCardFormValuesT;
  errors: CreditCardFormErrorsT;
};

export default class EditCreditCardForm extends React.Component<Props, State> {
  creditCardForm?: CreditCardForm;

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

  onSubmit = async () => {
    if (this.creditCardForm.isValid()) {
      const cardPaymentMethod = await this.creditCardForm.createStripePaymentMethod();
      const token = cardPaymentMethod.id;
      console.log(token, cardPaymentMethod);
      let creditCard = {
        id: token,
        creditCardName: cardPaymentMethod.billing_details.name,
        expires: `${cardPaymentMethod.card.exp_month}/${cardPaymentMethod.card.exp_year}`,
        last4: cardPaymentMethod.card.last4,
        isDefault: false,
      };
      this.props.onSave(creditCard);
    }
  };

  resetForm = () => {};

  setResetFormMethod = (reset) => {
    this.resetForm = reset;
  };

  render() {
    return (
      <div
        className={cn(styles.EditCreditCardForm, {
          [styles.visible]: this.props.visible === true,
        })}
      >
        <div className={styles.title}>Add a New Card</div>
        <CreditCardForm
          useStripe
          addNewCard
          visible
          onChange={() => {
            this.creditCardForm?.validateForm();
          }}
          componentRef={(ref) => {
            this.creditCardForm = ref;
          }}
          setResetFormMethod={this.setResetFormMethod}
        />
        <div className={styles.buttons}>
          <div className={styles.formButtonsEdit}>
            <React.Fragment>
              <button className={styles.cancelButton} onClick={this.resetForm}>
                Cancel
              </button>
              <button className={styles.saveChanges} onClick={this.onSubmit}>
                Save Changes
              </button>
            </React.Fragment>
          </div>
        </div>
      </div>
    );
  }
}
