import Loader from "components/common/Loader/Loader";
import { ORDER_CONFIRMATION_URL, PAYMENT_URL } from "constants/urls";
import { AppContextState, AppContext } from "context/AppContext";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PaypalSuccess.module.scss";

type Props = RouteComponentProps;

class PaypalSuccess extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  async componentDidMount() {
    await this.context.requestCurrentCustomer();
    await this.context.requestCartInfo();

    const paramsString = this.props.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const paypalToken = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    if (paypalToken && payerId) {
      try {
        await this.context.setPaymentMethod({
          cart_id: this.context.cart.id,
          payment_method: {
            code: "paypal_express",
            paypal_express: {
              payer_id: payerId,
              token: paypalToken,
            },
          },
        });
        await this.context.placeOrder();
        this.props.history.replace(ORDER_CONFIRMATION_URL);
      } catch (e) {
        console.error(e);
        this.props.history.replace(PAYMENT_URL);
        return;
      }
    } else {
      this.props.history.replace(PAYMENT_URL);
    }
  }

  render() {
    return (
      <Loader
        containerClassName={styles.loaderContainer}
        loaderClassName={styles.loader}
      />
    );
  }
}

export default withRouter(PaypalSuccess);
