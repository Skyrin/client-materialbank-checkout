import styles from "./AddSampleModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { get } from "lodash-es";
import PriceIndicator from "../PriceIndicator/PriceIndicator";
import { isOnMobile } from "../../../utils/responsive";
import { graphqlRequest } from "../../../GraphqlClient";

type State = {
  isLoading: boolean;
  quantity: number;
  showFullDescription: boolean;
};
type Props = any;

export class AddSampleModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      quantity: 1,
      showFullDescription: false,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.closeModal();
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#addSampleId");
    this.disableWindowsScroll();
  }

  componentWillUnmount() {
    this.enableWindowScroll();
  }

  enableWindowScroll = () => {
    enableBodyScroll(this.modalTarget);
  };

  disableWindowsScroll = () => {
    disableBodyScroll(this.modalTarget);
  };

  getProductSku = () => {
    return get(this.context.getModalParams(), "productSku");
  };

  formatTotalPrice = () => {
    const product = this.context.productsCache.getProduct(this.getProductSku());
    return `$${this.state.quantity * (product.data?.price?.USD?.default || 0)}`;
  };

  addSampleToCart = async () => {
    console.log("ADD TO CART", this.state.quantity);
    this.setState({ isLoading: true });
    const Mutation = `
      mutation {
        addSimpleProductsToCart(
          input: {
            cart_id: "${this.context.cart.id}"
            cart_items: [
              {
                data: {
                  quantity: ${this.state.quantity}
                  sku: "${this.getProductSku()}"
                }
              }
            ]
          }
        ) {
          cart {
            id
          }
        }
      }
    `;
    try {
      const resp = await graphqlRequest(this.context, Mutation);
      console.log("RESP", resp);
    } catch (e) {
      console.error(e);
    } finally {
      await this.context.requestCartInfo();
      this.setState({ isLoading: false });
      this.context.closeModal();
    }
  };

  render() {
    const product = this.context.productsCache.getProduct(this.getProductSku());
    return (
      <div
        id={"backgroundModalId"}
        className={cn(styles.modalBackground)}
        onClick={(event) => {
          // @ts-ignore
          if (event.target.id === "backgroundModalId") {
            this.onBackgroundClicked();
          }
        }}
      >
        <div id={"addSampleId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <img
              className={styles.productImage}
              src={product.data?.image_url}
              alt=""
            />
            <div className={styles.productInfo}>
              <div className={styles.manufacturer}>
                {product.data?.manufacturer}
              </div>
              <div className={styles.name}>{product.data?.name}</div>
              <div className={styles.pricePerSample}>
                {`$${product.data?.price?.USD?.default || 0} / sample`}
                <PriceIndicator
                  className={styles.priceIndicator}
                  maxPrice={3}
                  priceValue={(3 * product.data?.price_sign?.length) / 5}
                />
              </div>
              {product.data?.description && (
                <div
                  className={cn(styles.description, {
                    [styles.full]: this.state.showFullDescription,
                  })}
                  onClick={() => {
                    this.setState({ showFullDescription: true });
                  }}
                >
                  {product.data?.description}
                  {isOnMobile() && !this.state.showFullDescription && (
                    <span className={styles.showMore}>...show more</span>
                  )}
                </div>
              )}
            </div>
            <div className={styles.quantityContainer}>
              Quantity
              <div
                className={cn(styles.quantityButton, {
                  [styles.disabled]: this.state.quantity <= 1,
                })}
                onClick={() => {
                  this.setState({ quantity: this.state.quantity - 1 });
                }}
              >
                -
              </div>
              {this.state.quantity}
              <div
                className={styles.quantityButton}
                onClick={() => {
                  this.setState({ quantity: this.state.quantity + 1 });
                }}
              >
                +
              </div>
            </div>
            <button
              className={styles.addToCartButton}
              onClick={this.addSampleToCart}
              disabled={this.state.isLoading}
            >
              <span>add sample to cart</span>
              <span className={styles.price}>{this.formatTotalPrice()}</span>
            </button>
          </div>
        </div>
        {this.state.isLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  }
}
