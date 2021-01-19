import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import mockPayments from "models/paymentMethodMock.json";
import PaymentMethod from "models/PaymentMethod";
import styles from "./UserBilling.module.scss";
import cn from "classnames";

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
              console.log(paymentMethod);
              return (
                <div key={paymentMethod.id} className={styles.paymentCell}>
                  <div className={styles.paymentRow}>
                    <div>{paymentMethod.creditCard.number}</div>
                    <div>{paymentMethod.creditCard.name}</div>
                    {!paymentMethod.isDefault && (
                      <div className={styles.makeDefault}>Make Default</div>
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
}
