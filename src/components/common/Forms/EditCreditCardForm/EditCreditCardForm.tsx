import styles from "./EditCreditCardForm.module.scss";
import * as React from "react";
import { DEFAULT_CREDIT_CARD_FORM_VALUES } from "components/common/Forms/CreditCardForm/CreditCardForm";
import cn from "classnames";
import Input from "components/common/Input/Input";

export type CreditCardFormValuesT = {
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
  visible?: boolean;
};

type State = {
  values: CreditCardFormValuesT;
  errors: CreditCardFormErrorsT;
};

export default class EditCreditCardForm extends React.Component<Props, State> {
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

  render() {
    return (
      <div
        className={cn(styles.EditCreditCardForm, {
          [styles.visible]: this.props.visible === true,
        })}
      >
        <div className={styles.title}>Edit this Card</div>
        <div className={styles.form}>
          <div className={styles.cardNumber}>
            <div className={styles.inputHint}>Card Number</div>
            <Input
              placeholder="xxxx xxxx xxxx xxxx"
              value={this.state.values.creditCardNumber}
              onChange={(val: string) => {}}
            />
          </div>

          <div className={styles.cardName}>
            <div className={styles.inputHint}>Name on Card</div>
            <Input
              placeholder="First M. Last"
              value={this.state.values.creditCardNumber}
              onChange={(val: string) => {}}
            />
          </div>

          <div className={styles.cardExpiration}>
            <div className={styles.inputHint}>Expiration</div>
            <Input
              placeholder="MM / YY"
              value={this.state.values.creditCardNumber}
              onChange={(val: string) => {}}
            />
          </div>

          <div className={styles.cardCvv}>
            <div className={styles.inputHint}>CVV</div>
            <Input
              placeholder="xxx"
              value={this.state.values.creditCardNumber}
              onChange={(val: string) => {}}
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.deleteButton}>DELETE THIS CARD</button>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveChanges}>Save Changes</button>
        </div>
      </div>
    );
  }
}
