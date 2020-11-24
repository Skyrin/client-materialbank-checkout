import { AppContext, AppContextT } from "context/AppContext";
import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./Cart.module.scss";
import cn from "classnames";
import Logo from "components/common/Logo/Logo";
import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import { BREADCRUMBS_STEPS } from "constants/general";
import { PERSONAL_INFORMATION_URL } from "constants/urls";
import { request } from "GraphqlClient";
import Checkbox from "components/common/Checkbox/Checkbox";

type Props = RouteComponentProps;

type State = {
  products: any[];
  debugCheckbox: boolean;
};

export class Cart extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextT;

  state = {
    products: [],
    debugCheckbox: false,
  };

  updateCart = () => {
    // This is just used to test the updating of the context
    const id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5);
    this.context.updateCart({ id: id });
  };

  dummyGraphqlQuery = async () => {
    const query = `
      query{
        products(pageSize: 10, search: "a"){
          items {
            id
            name
            image {
              url
            }
            price_range {
              minimum_price {
                regular_price {
                  value
                  currency
                }
              }
              maximum_price {
                regular_price {
                  value
                  currency
                }
              }
            }
          }
          total_count
        }
      }
    `;
    try {
      const resp = await request(query);
      console.log(resp);
    } catch (e) {
      console.error(e);
    }
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
        <pre>{JSON.stringify(cartData)}</pre>
        <button onClick={this.updateCart} style={{ marginBottom: 20 }}>
          Randomize cart id
        </button>
        <button onClick={this.dummyGraphqlQuery} style={{ marginBottom: 20 }}>
          Trigger GraphQL query (will get CORS error for now)
        </button>
        [INPUTS]
        <Checkbox
          value={this.state.debugCheckbox}
          onChange={(val: boolean) => this.setState({ debugCheckbox: val })}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={cn("funnel-page", styles.Cart)}>
        <Logo className={styles.logo} />
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
