import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Cart.module.scss";
import cn from "classnames";
import { PERSONAL_INFORMATION_URL } from "constants/urls";
import Checkbox from "components/common/Checkbox/Checkbox";
import RadioButton from "components/common/RadioButton/RadioButton";
import AddressForm from "components/common/Forms/AddressForm/AddressForm";
import CreditCardForm from "components/common/Forms/CreditCardForm/CreditCardForm";
import { createCollection } from "context/CollectionsAPI/api";
import { RESTRequest } from "RestClient";

type Props = RouteComponentProps;

type State = {
  products: any[];
  showCartDebug: boolean;
  showCustomerDebug: boolean;
  debugCheckbox: boolean;
  debugCheckbox2: boolean;
  debugTextInput: string;
  debugCardNumberInput: string;
  debugTextInputParsed: string;
  debugGraphqlResponse: string;
  debugNumberOnlyInput: string;
  debugRadioButtons: string;
};

export class Cart extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;

  cardRef: CreditCardForm;

  state = {
    products: [],
    showCartDebug: false,
    showCustomerDebug: false,
    debugCheckbox: false,
    debugCheckbox2: false,
    debugTextInput: "",
    debugCardNumberInput: "",
    debugTextInputParsed: "",
    debugGraphqlResponse: "{}",
    debugNumberOnlyInput: "",
    debugRadioButtons: "",
  };

  renderDebug() {
    const cartData = this.context.cart;
    const customerData = this.context.customer;
    return (
      <React.Fragment>
        [CONTEXT DEBUG AREA]
        <br />
        <button
          className="button"
          onClick={async () => {
            await this.context.createTestCart();
          }}
        >
          Create Test Cart
        </button>
        <br />
        <button
          className="button"
          onClick={async () => {
            const resp = await RESTRequest("GET", "customers/me");
            console.log("REST USER RESP", resp);
            const user = await resp.json();
            console.log("REST USER RESP JSON", user);
          }}
        >
          Request User Via REST
        </button>
        <br />
        <button
          className="button"
          onClick={async () => {
            const resp = await createCollection(this.context, "Test", false);
            console.log(resp);
          }}
        >
          Create Test Collection
        </button>
        <br />
        [CART]
        <br />
        Context cart data:
        <br />
        <button
          className="button"
          onClick={() => {
            this.setState({ showCartDebug: !this.state.showCartDebug });
          }}
        >
          Toggle Cart Debug
        </button>
        {this.state.showCartDebug && (
          <pre>{JSON.stringify(cartData, null, 2)}</pre>
        )}
        <br />
        [CUSTOMER]
        <br />
        Context customer data:
        <br />
        <button
          className="button"
          onClick={() => {
            this.setState({ showCustomerDebug: !this.state.showCustomerDebug });
          }}
        >
          Toggle Customer Debug
        </button>
        {this.state.showCartDebug && (
          <pre>{JSON.stringify(customerData, null, 2)}</pre>
        )}
        <br />
        [INPUTS]
        <div className={styles.debugInputContainer}>
          <div className={styles.debugInlineContainer}>
            <Checkbox
              className={styles.debugCheckbox}
              value={this.state.debugCheckbox}
              onChange={(val: boolean) => this.setState({ debugCheckbox: val })}
            />
            <span>Checkbox 1</span>
            <Checkbox
              className={styles.debugCheckbox}
              value={this.state.debugCheckbox2}
              onChange={(val: boolean) =>
                this.setState({ debugCheckbox2: val })
              }
            />
            <span>Checkbox 2</span>
            <RadioButton
              className={styles.debugRadioButton}
              value={this.state.debugRadioButtons}
              option="OPTION_A"
              onChange={(val: string) => {
                this.setState({ debugRadioButtons: val });
              }}
            />
            <span>OPTION_A</span>
            <RadioButton
              className={styles.debugRadioButton}
              value={this.state.debugRadioButtons}
              option="OPTION_B"
              onChange={(val: string) => {
                this.setState({ debugRadioButtons: val });
              }}
            />
            <span>OPTION_B</span>
          </div>
          <CreditCardForm
            useStripe
            componentRef={(ref) => {
              this.cardRef = ref;
            }}
            onChange={(vals) => {
              console.log(vals);
            }}
            visible
          />
          <CreditCardForm
            onChange={(vals) => {
              console.log(vals);
            }}
            visible
          />
          <AddressForm
            withAutocomplete
            onChange={(addr) => {
              console.log("ADDRESS CHANGED", addr);
            }}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={cn("funnel-page", styles.Cart)}>
        {this.renderDebug()}
        <div className={styles.navigationContainer}>
          <span />
          <button
            className="button large"
            onClick={() => {
              this.props.history.push(PERSONAL_INFORMATION_URL);
            }}
          >
            Continue to Information
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Cart);
