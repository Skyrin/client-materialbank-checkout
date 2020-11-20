import { AppContext, AppContextT } from "context/AppContext";
import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Cart.module.scss";
import cn from "classnames";
import Logo from "components/common/Logo/Logo";
import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import { BREADCRUMBS_STEPS } from "constants/general";

type Props = RouteComponentProps;

type State = {
  products: any[];
};

export class Cart extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextT;

  state = {
    products: [],
  };

  updateCart = () => {
    // This is just used to test the updating of the context
    const id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5);
    this.context.updateCart({ id: id });
  };

  render() {
    const cartData = this.context.cart;
    return (
      <div className={cn("funnel-page", styles.Cart)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        Context cart data
        <br />
        {JSON.stringify(cartData)}
        <button onClick={this.updateCart}>Randomize cart id</button>
      </div>
    );
  }
}

export default withRouter(Cart);
