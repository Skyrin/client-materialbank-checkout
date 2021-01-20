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
import { CreditCardType } from "models/CreditCard";
import EditCreditCardForm from "components/common/Forms/EditCreditCardForm/EditCreditCardForm";

type Props = RouteComponentProps;

type State = {
  paymentMethods: PaymentMethod[];
};

export default class UserBilling extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethods: mockPayments.map((payment) => new PaymentMethod(payment)),
    };
    console.log(this.state);
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
                  {paymentMethod.isOpen && <EditCreditCardForm />}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  editPayment(index: number) {
    const paymentMethods = this.state.paymentMethods;
    paymentMethods[index].isOpen = !paymentMethods[index].isOpen;

    this.setState({
      paymentMethods: paymentMethods,
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
