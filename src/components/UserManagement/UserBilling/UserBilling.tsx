import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import PaymentMethod from "models/PaymentMethod";
import styles from "./UserBilling.module.scss";
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

type Props = RouteComponentProps;

type State = {
  paymentMethods: PaymentMethod[];
  customer: CustomerT;
};

export default class UserBilling extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;

  addCreditCardForm?: EditCreditCardForm;
  paymentMethods: any;

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
  }

  renderMobilePaymentRow(paymentMethod, index) {
    let updatedPayment = this.paymentMethods[index];
    return (
      <div className={styles.paymentRow}>
        <div className={styles.creditCardDetails}>
          <img
            src={this.getCreditCardIcon(paymentMethod)}
            alt=""
            className={styles.creditCardIcon}
          />
          <div className={styles.creditCardNumber}>
            xxxx xxxx xxxx
            {updatedPayment.creditCard
              ? updatedPayment.creditCard.creditCardNumber.substr(-4)
              : paymentMethod.last4}
          </div>
          {paymentMethod.isDefault && (
            <div className={styles.defaultPayment}>DEFAULT</div>
          )}
        </div>
        <div className={styles.deleteButtonContainer}>
          <button
            className={styles.deleteButton}
            onClick={() => this.deleteCard(paymentMethod.token)}
          >
            Delete this card
          </button>
          <button
            className={styles.setDefaultButton}
            onClick={() => this.makeDefault(paymentMethod.token)}
          >
            Set as default
          </button>
        </div>
      </div>
    );
  }

  renderDesktopPaymentRow(paymentMethod, index) {
    let updatedPayment = this.paymentMethods[index];
    return (
      <div className={styles.paymentRow}>
        <img
          src={this.getCreditCardIcon(paymentMethod)}
          alt=""
          className={styles.creditCardIcon}
        />
        <div className={styles.creditCardNumber}>
          xxxx xxxx xxxx {}
          {updatedPayment.creditCard
            ? updatedPayment.creditCard.creditCardNumber.substr(-4)
            : paymentMethod.last4}
        </div>
        <div className={styles.fullName}>
          {updatedPayment.creditCard
            ? updatedPayment.creditCard.creditCardName
            : paymentMethod.name}
          {paymentMethod.isDefault && (
            <div className={styles.defaultPayment}>DEFAULT</div>
          )}
        </div>
        <div className={styles.deleteButtonContainer}>
          <button
            className={styles.deleteButton}
            onClick={() => this.deleteCard(paymentMethod.token)}
          >
            Delete this card
          </button>
          <button
            className={styles.setDefaultButton}
            onClick={() => this.makeDefault(paymentMethod.token)}
          >
            Set as default
          </button>
        </div>
      </div>
    );
  }

  render() {
    const storedPaymentMethods = this.context.storedPaymentMethods;
    if (this.state.paymentMethods.length > 0) {
      this.paymentMethods = this.state.paymentMethods;
    } else {
      this.paymentMethods = storedPaymentMethods;
    }
    return (
      <div className={styles.UserBilling}>
        <UserHeader
          title={UserPages.Billing.name}
          customer={this.state.customer}
        />
        <div className={styles.pageContent}>
          {this.paymentMethods.map((paymentMethod, index) => {
            return (
              <div key={paymentMethod.id} className={styles.paymentCell}>
                {isOnMobile() &&
                  this.renderMobilePaymentRow(paymentMethod, index)}
                {!isOnMobile() &&
                  this.renderDesktopPaymentRow(paymentMethod, index)}
                {paymentMethod.isOpen && <div className="horizontal-divider" />}
                {paymentMethod.isOpen && (
                  <EditCreditCardForm
                    initialValues={{
                      isDefault: false,
                      id: paymentMethod.token,
                      expires: paymentMethod.expires,
                      last4: paymentMethod.last4,
                    }}
                    visible={paymentMethod.isOpen}
                    onSave={(values) => {
                      this.savePayment(values);
                    }}
                    onCancel={(token: string) => {
                      this.cancelSave(token);
                    }}
                    onDelete={(token: string) => {
                      this.deleteCard(token);
                    }}
                    onSetDefault={(token: string) => {
                      this.makeDefault(token);
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
              onCancel={(token: string) => {
                this.cancelSave(token);
              }}
              onDelete={(token: string) => {
                this.deleteCard(token);
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

  editPayment(index: any) {
    const paymentMethods = this.paymentMethods.map((paymentMethod, itIndex) => {
      if (itIndex !== index) {
        paymentMethod.isOpen = false;
      }
      return paymentMethod;
    });
    paymentMethods[index].isOpen = !paymentMethods[index].isOpen;
    this.setState({
      paymentMethods: paymentMethods,
    });
  }

  savePayment(creditCardValues: CreditCardFormValuesT) {
    const creditCard = new CreditCard({
      number: creditCardValues.creditCardNumber,
      name: creditCardValues.creditCardName,
      expiration: creditCardValues.expires,
      last4: creditCardValues.last4,
      cvv: creditCardValues.cardCVV,
    });
    if (creditCardValues.id) {
      const newPaymentMethods = this.paymentMethods.map((paymentMethod) => {
        if (paymentMethod.token === creditCardValues.id) {
          paymentMethod.creditCard = creditCardValues;
        }
        return paymentMethod;
      });
      this.setState({
        paymentMethods: creditCardValues,
      });
      this.editPayment(
        newPaymentMethods.findIndex(
          (paymentMethod) => paymentMethod.token === creditCardValues.id
        )
      );
    } else {
      const newPaymentMethod = new PaymentMethod();
      newPaymentMethod.token = String(Math.random());
      newPaymentMethod.creditCard = creditCardValues;

      const newPaymentMethods = this.paymentMethods;
      newPaymentMethods.push(newPaymentMethod);

      this.addCreditCardForm.resetForm();

      this.setState({
        paymentMethods: newPaymentMethods,
      });
    }
  }

  cancelSave(token: string) {
    if (token) {
      this.editPayment(
        this.paymentMethods.findIndex(
          (paymentMethod) => paymentMethod.token === token
        )
      );
    }
  }

  deleteCard(token: string) {
    const newPayments = this.paymentMethods.filter(
      (payment) => payment.token !== token
    );
    this.setState({
      paymentMethods: newPayments,
    });
  }

  makeDefault(token: string) {
    let paymentMethods = this.paymentMethods;
    paymentMethods = paymentMethods.map((paymentMethod) => ({
      ...paymentMethod,
      isDefault: false,
    }));

    paymentMethods.find((payment) => payment.token === token).isDefault = true;

    this.setState({
      paymentMethods: paymentMethods,
    });
  }

  getCreditCardIcon(paymentMethod: PaymentMethod) {
    switch (paymentMethod.cardType) {
      case "Visa":
        return visaIcon;
      case "American Express":
        return amexIcon;
      case "MasterCard":
        return masterCardIcon;
      default:
        return creditCardIcon;
    }
  }
}
