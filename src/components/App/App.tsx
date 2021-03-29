import React from "react";
import styles from "./App.module.scss";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import {
  CHECKOUT_FUNNEL_URL,
  COLLECTIONS_AND_PALETTES_URL,
  USER_MANAGEMENT_URL,
} from "constants/urls";
import cn from "classnames";
import CheckoutFunnel from "components/CheckoutFunnel/CheckoutFunnel";
import UserManagement from "components/UserManagement/UserManagement";
import { isOnMobile } from "utils/responsive";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import {
  AUTH_TOKEN_STORAGE_KEY,
  GUEST_CART_ID_STORAGE_KEY,
} from "constants/general";
import "@stripe/stripe-js"; // Import Stripe.js at startup
import { LoginModal } from "components/common/LoginModal/LoginModal";
import UploadPhotoModal from "components/common/UploadPhotoModal/UploadPhotoModal";
import { CreateCollectionModal } from "../common/CreateCollectionModal/CreateCollectionModal";
import { RegisterOptionsModal } from "components/common/RegisterModal/RegisterOptionsModal";
import { RegisterMailModal } from "components/common/RegisterMailModal/RegisterMailModal";
import { AccountExistsModal } from "components/common/AccountExistsModal/AccountExistsModal";
import { CreateCustomerInput } from "context/CustomerAPI/models";
import CollectionsAndPalettes from "../CollectionsAndPalettes/CollectionsAndPalettes";
import DeleteCollectionModal from "../common/DeleteCollectionModal/DeleteCollectionModal";
import DeleteItemModal from "../common/DeleteItemModal/DeleteItemModal";
import { ShareCollectionModal } from "../common/ShareCollectionModal/ShareCollectionModal";
import DuplicateCollectionModal from "../common/DuplicateCollectionModal/DuplicateCollectionModal";
import { MakePrivateModal } from "../common/MakePrivateModal/MakePrivateModal";

type State = {
  createCustomerInput: CreateCustomerInput;
};

type Props = RouteComponentProps;

class App extends React.Component<any, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldIsOnMobile = isOnMobile();

  constructor(props: Props) {
    super(props);
    this.state = {
      createCustomerInput: null,
    };
  }

  resizeHandler = () => {
    // If isOnMobile toggles, force a re-render of the app
    const newIsOnMobile = isOnMobile();
    if (newIsOnMobile !== this.oldIsOnMobile) {
      this.oldIsOnMobile = newIsOnMobile;
      this.forceUpdate();
    }
  };

  async componentDidMount() {
    window.addEventListener("resize", this.resizeHandler);
    if (localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
      await this.context.requestCurrentCustomer();
      await this.context.requestCartInfo();

      // TODO: Remove this once the storefront will have support for logged-in customers
      const storageGuestCartId = localStorage.getItem(
        GUEST_CART_ID_STORAGE_KEY
      );
      if (storageGuestCartId) {
        await this.context.mergeGuestCart();
      }
    } else {
      const storageGuestCartId = localStorage.getItem(
        GUEST_CART_ID_STORAGE_KEY
      );
      if (storageGuestCartId) {
        await this.context.requestCartInfo(storageGuestCartId);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.App}>
          <Switch>
            <Redirect exact from="/" to={CHECKOUT_FUNNEL_URL} />
            <Route path={CHECKOUT_FUNNEL_URL} component={CheckoutFunnel} />
            <Route path={USER_MANAGEMENT_URL} component={UserManagement} />
            <Route
              path={COLLECTIONS_AND_PALETTES_URL}
              component={CollectionsAndPalettes}
            />
          </Switch>
        </div>
        {this.context.getModalOpen() === Modals.UploadPhoto && (
          <UploadPhotoModal />
        )}
        {this.context.getModalOpen() === Modals.CreateCollection && (
          <CreateCollectionModal />
        )}
        {this.context.getModalOpen() === Modals.ShareCollection && (
          <ShareCollectionModal />
        )}
        {this.context.getModalOpen() === Modals.DuplicateCollection && (
          <DuplicateCollectionModal />
        )}
        {this.context.getModalOpen() === Modals.DeleteCollection && (
          <DeleteCollectionModal />
        )}
        {this.context.getModalOpen() === Modals.DeleteItem && (
          <DeleteItemModal />
        )}
        {this.context.getModalOpen() === Modals.MakePrivateCollection && (
          <MakePrivateModal />
        )}
        {this.context.getModalOpen() === Modals.Login && <LoginModal />}
        {this.context.getModalOpen() === Modals.RegisterOptions && (
          <RegisterOptionsModal />
        )}
        {this.context.getModalOpen() === Modals.RegisterEmail && (
          <RegisterMailModal
            onAccountExistsError={(value) => {
              this.createCustomerAlreadyExists(value);
            }}
          />
        )}
        {this.context.getModalOpen() === Modals.AccountExists && (
          <AccountExistsModal
            createCustomerInput={this.state.createCustomerInput}
          />
        )}

        {/* Hidden icons that should make the browser pre-load the webfonts for fas(FontAwesome Solid) and far(FontAwesome Regular) */}
        <i className={cn("fas fa-star", styles.hiddenIcon)} />
        <i className={cn("far fa-star", styles.hiddenIcon)} />
        <i className={cn("fab fa-cc-visa", styles.hiddenIcon)} />
      </React.Fragment>
    );
  }

  createCustomerAlreadyExists = (createCustomerInput: CreateCustomerInput) => {
    this.context.closeModal();
    this.setState({
      createCustomerInput: createCustomerInput,
    });
    this.context.openModal(Modals.AccountExists);
  };
}

export default App;
