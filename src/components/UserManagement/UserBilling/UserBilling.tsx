import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import mockPayments from "models/paymentMethodMock.json";
import PaymentMethod from "models/PaymentMethod";
import styles from "./UserBilling.module.scss";
import cn from "classnames";

import amexIcon from "assets/images/amex_icon.svg";
import visaIcon from "assets/images/visa_icon.svg";
import masterCardIcon from "assets/images/master_card_icon.svg";
import creditCardIcon from "assets/images/credit_card_icon.svg";
import CreditCard, { CreditCardType } from "models/CreditCard";
import EditCreditCardForm, {
  CreditCardFormValuesT,
} from "components/common/Forms/EditCreditCardForm/EditCreditCardForm";
import CreditCardForm from "components/common/Forms/CreditCardForm/CreditCardForm";

type Props = RouteComponentProps;

type State = {
  paymentMethods: PaymentMethod[];
};

export default class UserBilling extends React.Component<Props, State> {
  addCreditCardForm?: EditCreditCardForm;

  constructor(props) {
    super(props);
    this.state = {
      paymentMethods: mockPayments.map((payment) => new PaymentMethod(payment)),
    };
  }

  render() {
    return (
      <div className={styles.UserBilling}>
        <UserHeader title={UserPages.Account.name} />
        <div className={styles.pageContent}>
          {this.state.paymentMethods.map(
            (paymentMethod: PaymentMethod, index) => {
              return (
                <div key={paymentMethod.id} className={styles.paymentCell}>
                  <div className={styles.paymentRow}>
                    <img
                      src={this.getCreditCardIcon(paymentMethod)}
                      className={styles.creditCardIcon}
                    />
                    <div className={styles.creditCardNumber}>
                      {paymentMethod.creditCard.getObfuscatedNumber()}
                    </div>
                    <div className={styles.fullName}>
                      {paymentMethod.creditCard.name}
                    </div>
                    {!paymentMethod.isDefault && (
                      <div
                        className={styles.makeDefault}
                        onClick={() => {
                          this.makeDefault(index);
                        }}
                      >
                        Make Default
                      </div>
                    )}
                    {paymentMethod.isDefault && (
                      <div className={styles.defaultPayment}>
                        DEFAULT PAYMENT METHOD
                      </div>
                    )}
                    <button
                      className={cn(styles.editButton, {
                        [styles.editMode]: paymentMethod.isOpen,
                      })}
                      onClick={() => {
                        this.editPayment(index);
                      }}
                    >
                      Edit
                      <i
                        className={cn("far fa-angle-up", styles.chevron, {
                          [styles.chevronUp]: paymentMethod.isOpen,
                          [styles.chevronDown]: !paymentMethod.isOpen,
                        })}
                      />
                    </button>
                  </div>
                  {paymentMethod.isOpen && (
                    <div className="horizontal-divider" />
                  )}

                  {/*{paymentMethod.isOpen && (*/}
                  <EditCreditCardForm
                    initialValues={{
                      id: paymentMethod.id,
                      creditCardNumber: paymentMethod.creditCard.number,
                      creditCardName: paymentMethod.creditCard.name,
                      cardDate: paymentMethod.creditCard.expiration,
                      cardCVV: paymentMethod.creditCard.cvv,
                    }}
                    visible={paymentMethod.isOpen}
                    onSave={(values) => {
                      this.savePayment(values);
                    }}
                    onCancel={(id: string) => {
                      this.cancelSave(id);
                    }}
                    onDelete={(id: string) => {
                      this.deleteCard(id);
                    }}
                  />
                  {/*)}*/}
                </div>
              );
            }
          )}
          <div className={styles.addCreditCardContainer}>
            <EditCreditCardForm
              visible={true}
              onSave={(values) => {
                this.savePayment(values);
              }}
              onCancel={(id: string) => {
                this.cancelSave(id);
              }}
              onDelete={(id: string) => {
                this.deleteCard(id);
              }}
              componentRef={(ref) => {
                this.addCreditCardForm = ref;
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  editPayment(index: number) {
    const paymentMethods = this.state.paymentMethods.map(
      (paymentMethod, itIndex) => {
        if (itIndex !== index) {
          paymentMethod.isOpen = false;
        }
        return paymentMethod;
      }
    );
    paymentMethods[index].isOpen = !paymentMethods[index].isOpen;

    this.setState({
      paymentMethods: paymentMethods,
    });
  }

  savePayment(creditCardValues: CreditCardFormValuesT) {
    const creditCard = new CreditCard({
      number: creditCardValues.creditCardNumber,
      name: creditCardValues.creditCardName,
      expiration: creditCardValues.cardDate,
      cvv: creditCardValues.cardCVV,
    });
    if (creditCardValues.id) {
      const newPaymentMethods = this.state.paymentMethods.map(
        (paymentMethod) => {
          if (paymentMethod.id === creditCardValues.id) {
            paymentMethod.creditCard = creditCard;
          }
          return paymentMethod;
        }
      );
      this.setState({
        paymentMethods: newPaymentMethods,
      });
      this.editPayment(
        newPaymentMethods.findIndex(
          (paymentMethod) => paymentMethod.id === creditCardValues.id
        )
      );
    } else {
      const newPaymentMethod = new PaymentMethod();
      newPaymentMethod.id = String(Math.random());
      newPaymentMethod.creditCard = creditCard;

      const newPaymentMethods = this.state.paymentMethods;
      newPaymentMethods.push(newPaymentMethod);

      this.addCreditCardForm.resetForm();

      this.setState({
        paymentMethods: newPaymentMethods,
      });
    }
  }

  cancelSave(id: string) {
    if (id) {
      this.editPayment(
        this.state.paymentMethods.findIndex(
          (paymentMethod) => paymentMethod.id === id
        )
      );
    }
  }

  deleteCard(id: string) {
    const newPayments = this.state.paymentMethods.filter(
      (payment) => payment.id !== id
    );
    this.setState({
      paymentMethods: newPayments,
    });
  }

  makeDefault(index: number) {
    const paymentMethods = this.state.paymentMethods;

    paymentMethods.map((paymentMethod) => {
      paymentMethod.isDefault = false;
    });
    paymentMethods[index].isDefault = true;
    this.setState({
      paymentMethods: paymentMethods,
    });
  }

  getCreditCardIcon(paymentMethod: PaymentMethod) {
    switch (paymentMethod.creditCard.getCreditCardBrand()) {
      case CreditCardType.AmericanExpress:
        return amexIcon;
      case CreditCardType.MasterCard:
        return masterCardIcon;
      case CreditCardType.Visa:
        return visaIcon;
      case CreditCardType.Diners:
      case CreditCardType.Discover:
      case CreditCardType.JCB:
      case CreditCardType.Unknown:
        return creditCardIcon;
    }
  }
}
