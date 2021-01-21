import { CartT, CustomerT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextState } from "./AppContext";
import { cloneDeep, isArray, isString, merge, mergeWith } from "lodash-es";
import {
  applyCouponToCart,
  CartAddressInput,
  removeCouponFromCart,
  requestCustomerCartInfo,
  requestGuestCartInfo,
  setBillingAddressOnCart,
  setShippingAddressOnCart,
} from "./CheckoutAPI";
import {
  createCustomer,
  CreateCustomerInput,
  CustomerAddressInput,
  login,
  requestCurrentCustomer,
  createCustomerAddress,
} from "./CustomerAPI";
import { PaymentOption } from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";

type Props = {
  children: React.ReactNode;
};

const fieldCustomizer = (objValue: any, newValue: any) => {
  // Replace arrays when merging carts / customer
  // This will ensure that we always keep only the received items, and they don't merge with any existing ones.
  if (isArray(objValue)) {
    return newValue;
  }
};

export default class AppContextManager extends React.Component<Props> {
  // 'contextState' holds the context data
  private contextState: AppContextState = new AppContextState();

  // 'actions' holds all the functions which can be used by context consumers to manipulate the context
  private actions = {
    updateCart: (newCart: CartT) => {
      this.contextState.cart = mergeWith(
        this.contextState.cart,
        newCart,
        fieldCustomizer
      );
      this.forceUpdate();
      return this.contextState.cart;
    },

    updateCustomer: (newCustomer: CustomerT) => {
      this.contextState.customer = mergeWith(
        this.contextState.customer,
        newCustomer,
        fieldCustomizer
      );
      this.forceUpdate();
      return this.contextState.customer;
    },

    setLoggedIn: (newValue: boolean) => {
      this.contextState.isLoggedIn = newValue;
      this.forceUpdate();
    },

    requestCartInfo: async (cartId?: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      let cartInfo = {};
      if (this.contextState.isLoggedIn) {
        cartInfo = await requestCustomerCartInfo(this.getFullContext());
      } else {
        cartInfo = await requestGuestCartInfo(
          this.getFullContext(),
          cartId || ""
        );
      }
      console.log("GOT CART INFO", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(cartInfo);
      return this.contextState.cart;
    },

    requestCurrentCustomer: async () => {
      this.contextState.customerLoading = true;
      this.forceUpdate();
      const customer = await requestCurrentCustomer(this.getFullContext());
      console.log("GOT CUSTOMER", customer);
      this.contextState.customerLoading = false;
      this.actions.updateCustomer(customer);
      return this.contextState.customer;
    },

    login: async (email: string, password: string) => {
      const token = await login(this.getFullContext(), email, password);
      console.log("LOGIN", token);
      if (token && isString(token)) {
        localStorage.setItem("token", token);
        this.actions.setLoggedIn(true);
        const customer = await this.actions.requestCurrentCustomer();
        await this.actions.requestCartInfo();
        return customer;
      }
    },

    logout: () => {
      // TODO: Figure out what else we might need to do here
      localStorage.removeItem("token");
      this.contextState.isLoggedIn = false; // Change directly here so we don't trigger 2 updates
      this.contextState.customer = {};
      this.forceUpdate();
    },

    createCustomer: async (customer: CreateCustomerInput) => {
      this.contextState.customerLoading = true;
      await createCustomer(this.getFullContext(), customer);
      await this.actions.login(customer.email, customer.password);
    },

    applyCouponToCart: async (couponCode: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartId = this.contextState.cart.id;
      const cartInfo = await applyCouponToCart(
        this.getFullContext(),
        cartId,
        couponCode
      );
      console.log("COUPON", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(cartInfo);
      return this.contextState.cart;
    },

    removeCouponFromCart: async (couponCode: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartId = this.contextState.cart.id;
      const cartInfo = await removeCouponFromCart(
        this.getFullContext(),
        cartId,
        couponCode
      );
      console.log("REMOVED COUPON", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(cartInfo);
      return this.contextState.cart;
    },

    setBillingAddress: async (
      sameAsShipping: boolean,
      address?: CartAddressInput
    ) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartId = this.contextState.cart.id;
      const cartInfo = await setBillingAddressOnCart(
        this.getFullContext(),
        cartId as string,
        sameAsShipping,
        address
      );
      console.log("SET BILLING ADDRESS", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(cartInfo);
      return this.contextState.cart;
    },

    setShippingAddress: async (addressId: number) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartId = this.contextState.cart.id;
      const cartInfo = await setShippingAddressOnCart(
        this.getFullContext(),
        cartId as string,
        addressId
      );
      console.log("SET SHIPPING ADDRESS", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(cartInfo);
      return this.contextState.cart;
    },

    createCustomerAddress: async (address: CustomerAddressInput) => {
      this.contextState.customerLoading = true;
      this.forceUpdate();
      const createdAddress = await createCustomerAddress(
        this.getFullContext(),
        address
      );
      await this.actions.requestCurrentCustomer();
      return createdAddress;
    },

    setSelectedPaymentOption: (newValue: PaymentOption) => {
      this.contextState.selectedPaymentOption = newValue;
      this.forceUpdate();
    },
  };

  getFullContext = () => {
    const context = cloneDeep(this.contextState);
    merge(context, cloneDeep(this.actions));
    return context;
  };

  render() {
    // Provide both the cart data and the cart actions to consumers
    const context = this.getFullContext();

    return (
      <AppContext.Provider value={context}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
