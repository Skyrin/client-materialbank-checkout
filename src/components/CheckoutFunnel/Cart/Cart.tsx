import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Cart.module.scss";
import cn from "classnames";
import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import { BREADCRUMBS_STEPS } from "constants/general";
import { PERSONAL_INFORMATION_URL } from "constants/urls";
import Checkbox from "components/common/Checkbox/Checkbox";
import Input from "components/common/Input/Input";
import {
  cardNumberInputFormatter,
  cardNumberInputParser,
  digitsOnlyInputParser,
  expirationDateInputFormatter,
  expirationDateInputParser,
} from "components/common/Input/utils";
import RadioButton from "components/common/RadioButton/RadioButton";
import AddressInput from "components/common/Input/AddressInput/AddressInput";

type Props = RouteComponentProps;

type State = {
  products: any[];
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

  state = {
    products: [],
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
    return (
      <React.Fragment>
        [CONTEXT DEBUG AREA]
        <br />
        [CART]
        <br />
        Context cart data:
        <br />
        <pre>{JSON.stringify(cartData, null, 2)}</pre>
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
          </div>
          <div className={styles.debugInlineContainer}>
            <Checkbox
              className={styles.debugCheckbox}
              value={this.state.debugCheckbox2}
              onChange={(val: boolean) =>
                this.setState({ debugCheckbox2: val })
              }
            />
            <span>Checkbox 2</span>
          </div>
          <div>
            <div className={styles.debugInlineContainer}>
              <RadioButton
                className={styles.debugRadioButton}
                value={this.state.debugRadioButtons}
                option="OPTION_A"
                onChange={(val: string) => {
                  this.setState({ debugRadioButtons: val });
                }}
              />
              <span>OPTION_A</span>
            </div>
            <div className={styles.debugInlineContainer}>
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
          </div>
          <AddressInput
            onAddressSelected={(addr, info) => {
              console.log(addr, info);
            }}
          />
          <Input
            value={this.state.debugTextInput}
            onChange={(val: string) => this.setState({ debugTextInput: val })}
            placeholder="Normal text input"
          />
          <Input
            value={this.state.debugCardNumberInput}
            onChange={(val: string) =>
              this.setState({ debugCardNumberInput: val })
            }
            formatter={cardNumberInputFormatter}
            parser={cardNumberInputParser}
            placeholder="Card Number"
            inputMode="numeric"
          />
          <Input
            value={this.state.debugTextInputParsed}
            onChange={(val: string) =>
              this.setState({ debugTextInputParsed: val })
            }
            formatter={expirationDateInputFormatter}
            parser={expirationDateInputParser}
            placeholder="Expiration (MM/YR)"
            inputMode="numeric"
          />
          <Input
            value={this.state.debugNumberOnlyInput}
            onChange={(val: string) =>
              this.setState({ debugNumberOnlyInput: val })
            }
            parser={digitsOnlyInputParser}
            placeholder="Should only accept digits"
            inputMode="numeric"
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={cn("funnel-page", styles.Cart)}>
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
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
