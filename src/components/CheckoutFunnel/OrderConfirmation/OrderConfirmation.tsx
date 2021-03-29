import React from "react";
import cn from "classnames";
import styles from "./OrderConfirmation.module.scss";
import { scrollToTop } from "utils/general";
import { goToStorefront, USER_ACCOUNT_URL } from "constants/urls";
import { AppContext, AppContextState } from "context/AppContext";
import { get } from "lodash-es";
import Loader from "components/common/Loader/Loader";
import { RouteComponentProps, withRouter } from "react-router-dom";

type Props = RouteComponentProps;

class OrderConfirmation extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;

  async componentDidMount() {
    scrollToTop();

    // Order summary should always be open when on the confirmation page
    this.context.setOrderSummaryOpen(true);

    await this.context.requestConfirmedOrder();
  }

  renderCurrency = (value?: number, def?: string) => {
    if (!value) {
      return def;
    }
    return `$${value.toFixed(2)}`;
  };

  render() {
    if (this.context.confirmedOrderLoading) {
      return (
        <div className={cn("funnel-page", styles["OrderConfirmation"])}>
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        </div>
      );
    }

    const confirmedOrder = this.context.confirmedOrder || {};
    return (
      <div className={cn("funnel-page", styles["OrderConfirmation"])}>
        <div className={styles.title}>Summary</div>
        <div className={styles.totalsContainer}>
          <div className={styles.totalLine}>
            <div className={styles.label}>Subtotal</div>
            <div className={styles.value}>
              {this.renderCurrency(
                get(confirmedOrder, "total.subtotal.value"),
                "-"
              )}
            </div>
          </div>
          <div className={styles.totalLine}>
            <div className={styles.label}>Shipping</div>
            <div className={styles.value}>
              {this.renderCurrency(
                get(confirmedOrder, "total.total_shipping.value"),
                "-"
              )}
            </div>
          </div>
          <div className={styles.totalLine}>
            <div className={styles.label}>Estimated tax</div>
            <div className={styles.value}>
              {this.renderCurrency(
                get(confirmedOrder, "total.total_tax.value"),
                "-"
              )}
            </div>
          </div>
          <div className={styles.grandTotalLine}>
            <div className={styles.label}>Total</div>
            <div className={styles.value}>
              {this.renderCurrency(
                get(confirmedOrder, "total.grand_total.value"),
                "-"
              )}
            </div>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button
            className={styles.goToAccount}
            onClick={() => {
              this.props.history.replace(USER_ACCOUNT_URL);
            }}
          >
            Go to my account
          </button>
          <button
            className={styles.backToShop}
            onClick={() => {
              goToStorefront();
            }}
          >
            Back to Design Shop
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(OrderConfirmation);
