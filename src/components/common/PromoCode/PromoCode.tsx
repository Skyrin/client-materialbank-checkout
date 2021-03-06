import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import Input from "components/common/Input/Input";
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
};

export default class PromoCode extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;

  state = {
    promoCode: "",
    promoCodeError: null,
    isOpen: false,
  };

  applyCoupon = async () => {
    console.log("APPLY PROMO CODE", this.state.promoCode);
    try {
      await this.context.applyCouponToCart(this.state.promoCode);
      this.setState({
        promoCode: "",
      });
    } catch (e) {
      console.log("ERROR IN PROMO CODE COMPONENT", e);
      console.log(e.graphqlErrors);
      this.setState({ promoCodeError: e.graphqlErrors[0].message });
    }
  };

  removeCoupon = async (promoCode: string) => {
    console.log("REMOVE PROMO CODE", promoCode);
    try {
      await this.context.removeCouponFromCart(promoCode);
    } catch (e) {
      console.log("ERROR IN PROMO CODE COMPONENT", e);
      console.log(e.graphqlErrors);
      this.setState({ promoCodeError: e.graphqlErrors[0].message });
    }
  };

  render() {
    const promoCodes = this.context.cart?.applied_coupons || [];

    return (
      <div className={cn(styles.promoCodeContainer, this.props.className)}>
        <div
          className={styles.titleRow}
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <h4 className={styles.title}>Add a promotion code</h4>
          <i
            className={cn("fal", styles.promoCodeChevron, {
              "fa-chevron-up": this.state.isOpen,
              "fa-chevron-down": !this.state.isOpen,
            })}
          />
        </div>

        {promoCodes.length === 0 && (
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
            onActionButtonClick={this.applyCoupon}
          />
        )}

        {promoCodes.length > 0 && (
          <div className={styles.promoCodes}>
            {promoCodes.map((pc) => (
              <div className={styles.promoCode} key={`promo_code_${pc}`}>
                <div className={styles.codeWrapper}>
                  <i className={cn("far", "fa-tags", styles.couponIcon)} />
                  <span className={styles.code}>{pc.code}</span>
                </div>
                <i
                  className={cn("far", "fa-times", styles.removeCodeIcon)}
                  onClick={() => {
                    this.removeCoupon(pc);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
