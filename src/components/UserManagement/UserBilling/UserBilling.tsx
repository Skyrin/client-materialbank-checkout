import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import PaymentMethod from "models/PaymentMethod";
import styles from "./UserBilling.module.scss";
import cn from "classnames";

import amexIcon from "assets/images/amex_icon.svg";
import visaIcon from "assets/images/visa_icon.svg";
import masterCardIcon from "assets/images/master_card_icon.svg";
import creditCardIcon from "assets/images/credit_card_icon.svg";
import CreditCard from "models/CreditCard";
import EditCreditCardForm, {
  CreditCardFormValuesT,
} from "components/common/Forms/EditCreditCardForm/EditCreditCardForm";
import { isOnMobile } from "../../../utils/responsive";
import { CustomerT } from "constants/types";
import { AppContext, AppContextState } from "context/AppContext";
import Loader from "components/common/Loader/Loader";
import { RESTRequest } from "../../../RestClient";

type Props = RouteComponentProps;

type State = {
  paymentMethods: PaymentMethod[];
  customer: CustomerT;
};

export default class UserBilling extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;

  addCreditCardForm?: EditCreditCardForm;

  constructor(props) {
    super(props);
    this.state = {
      paymentMethods: [],
      customer: null,
    };
  }

  async componentDidMount() {
    this.context.requestCurrentCustomer().then((value) => {
      this.setState({
        customer: value,
      });
    });
    const response = await RESTRequest(
      "GET",
      "customers/me/stored-payment-methods"
    );
    const methods = await response.json();
    this.setState({ paymentMethods: methods });
  }

  renderMobilePaymentRow(paymentMethod, index) {
    return (
      <div className={styles.paymentRow}>
        <div className={styles.creditCardDetails}>
          <img
            src={this.getCreditCardIcon(paymentMethod)}
            alt=""
            className={styles.creditCardIcon}
          />
          <div className={styles.creditCardNumber}>
            xxxx xxxx xxxx {paymentMethod.last4}
          </div>
          {paymentMethod.isDefault && (
            <div className={styles.defaultPayment}>DEFAULT</div>
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
              className={cn("far fa-angle-down", styles.chevron, {
                [styles.chevronUp]: paymentMethod.isOpen,
                [styles.chevronDown]: !paymentMethod.isOpen,
              })}
            />
          </button>
        </div>
      </div>
    );
  }

  renderDesktopPaymentRow(paymentMethod, index) {
    return (
      <div className={styles.paymentRow}>
        <img
          src={this.getCreditCardIcon(paymentMethod)}
          alt=""
          className={styles.creditCardIcon}
        />
        <div className={styles.creditCardNumber}>
          xxxx xxxx xxxx {paymentMethod.last4}
        </div>
        <div className={styles.fullName}>
          {paymentMethod.expires}
          {paymentMethod.isDefault && (
            <div className={styles.defaultPayment}>DEFAULT</div>
          )}
        </div>
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
            className={cn("far fa-angle-down", styles.chevron, {
              [styles.chevronUp]: paymentMethod.isOpen,
              [styles.chevronDown]: !paymentMethod.isOpen,
            })}
          />
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.UserBilling}>
        <UserHeader
          title={UserPages.Billing.name}
          customer={this.state.customer}
        />
        <div className={styles.pageContent}>
          {this.state.paymentMethods.map((pay, index) => {
            return (
              <div key={pay.id} className={styles.paymentCell}>
                {isOnMobile() && this.renderMobilePaymentRow(pay, index)}
                {!isOnMobile() && this.renderDesktopPaymentRow(pay, index)}
                {pay.isOpen && <div className="horizontal-divider" />}

                {pay.isOpen && (
                  <EditCreditCardForm
                    initialValues={{
                      isDefault: false,
                      id: pay.id,
                      expires: pay.expires,
                      last4: pay.last4,
                    }}
                    visible={pay.isOpen}
                    onSave={(values) => {
                      this.savePayment(values);
                    }}
                    onCancel={(id: string) => {
                      this.cancelSave(id);
                    }}
                    onDelete={(id: string) => {
                      this.deleteCard(id);
                    }}
                    onSetDefault={(id: string) => {
                      this.makeDefault(id);
                    }}
                  />
                )}
              </div>
            );
          })}
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
        {this.context.customerLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
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

  makeDefault(id: string) {
    let paymentMethods = this.state.paymentMethods;

    paymentMethods = paymentMethods.map((paymentMethod) => ({
      ...paymentMethod,
      isDefault: false,
    }));

    paymentMethods.find((payment) => payment.id === id).isDefault = true;

    this.setState({
      paymentMethods: paymentMethods,
    });
  }

  getCreditCardIcon(paymentMethod: PaymentMethod) {
    switch (paymentMethod.cardType) {
      case "Visa":
        return visaIcon;
      case "AmericanExpress":
        return amexIcon;
      case "MasterCard":
        return masterCardIcon;
      default:
        return creditCardIcon;
    }
  }
}
