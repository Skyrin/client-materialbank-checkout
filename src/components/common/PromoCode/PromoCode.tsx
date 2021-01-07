import { AppContext, AppContextT } from "context/AppContext";
import * as React from "react";
import Input from "components/common/Input/Input";
import { get } from "lodash-es";
import styles from "./PromoCode.module.scss";
import cn from "classnames";

type Props = {
  className?: string;
  onPromoCodeAdded?: Function;
};

type State = {
  promoCode: string;
  promoCodeError: string | null;
  isOpen: boolean;
  promoCodes: string[];
};

export default class PromoCode extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextT;

  state = {
    promoCode: "",
    promoCodeError: null,
    isOpen: false,
    promoCodes: [],
  };

  onActionButtonClick = async () => {
    console.log("APPLY PROMO CODE", this.state.promoCode);
    try {
      await this.context.applyCouponToCart(
        get(this.context, "cart.id", ""),
        this.state.promoCode
      );
    } catch (e) {
      console.log("ERROR IN ORDER SUMMARY COMPONENT", e);
      console.log(e.graphqlErrors);
      this.setState({ promoCodeError: e.graphqlErrors[0].message });
    }
    this.setState({ promoCode: "" });
  };

  render() {
    return (
      <div className={cn(styles.promoCodeContainer, this.props.className)}>
        <div
          className={styles.titleRow}
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <h4 className={styles.title}>Have a promo code?</h4>
          <i
            className={cn("fal", styles.promoCodeChevron, {
              "fa-chevron-up": this.state.isOpen,
              "fa-chevron-down": !this.state.isOpen,
            })}
          />
        </div>

        <Input
          className={cn(styles.promoCodeInput, {
            [styles.visible]: this.state.isOpen,
          })}
          placeholder="Have a promo code?"
          value={this.state.promoCode}
          error={this.state.promoCodeError}
          onChange={(val: string) => {
            this.setState({ promoCode: val, promoCodeError: null });
          }}
          actionButton="Apply"
          onActionButtonClick={this.onActionButtonClick}
        />
      </div>
    );
  }
}
