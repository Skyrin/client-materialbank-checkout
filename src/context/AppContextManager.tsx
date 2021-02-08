import { CartT, CustomerT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextState } from "./AppContext";
import { cloneDeep, isArray, isString, merge, mergeWith } from "lodash-es";
import {
  applyCouponToCart,
  createTestCart,
  mergeGuestCart,
  placeOrder,
  removeCouponFromCart,
  requestCustomerCartInfo,
  requestGuestCartInfo,
  setBillingAddressOnCart,
  setPaymentMethod,
  setShippingAddressOnCart,
  setShippingMethodOnCart,
} from "./CheckoutAPI/api";
import { CartAddressInput } from "./CheckoutAPI/models";
import {
  createCustomer,
  login,
  requestCurrentCustomer,
  createCustomerAddress,
} from "./CustomerAPI/api";
import {
  CreateCustomerInput,
  CustomerAddressInput,
} from "./CustomerAPI/models";
import { PaymentOption } from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";
import {
  AUTH_TOKEN_STORAGE_KEY,
  GUEST_CART_ID_STORAGE_KEY,
  ORDER_ID_STORAGE_KEY,
} from "constants/general";

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
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
        this.actions.setLoggedIn(true);
        const customer = await this.actions.requestCurrentCustomer();
        await this.actions.requestCartInfo();
        return customer;
      } else {
        console.log("error ");
      }
    },

    openLoginModal: (shouldOpen: boolean) => {
      this.contextState.setInternalLoginModalOpen(shouldOpen);
      this.forceUpdate();
    },

    logout: async () => {
      // TODO: Figure out what else we might need to do here
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      this.contextState.isLoggedIn = false; // Change directly here so we don't trigger 2 updates
      this.contextState.customer = {};
      this.contextState.cart = {};
      this.forceUpdate();
      const newTestCart = await this.actions.createTestCart();
      await this.actions.updateCart(newTestCart);
      this.forceUpdate();
    },

    createCustomer: async (customer: CreateCustomerInput) => {
      this.contextState.customerLoading = true;
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      try {
        await createCustomer(this.getFullContext(), customer);
        await this.actions.login(customer.email, customer.password);
      } catch (e) {
        // Forward the error to the component, but hide the loaders regardless
        throw e;
      } finally {
        this.contextState.customerLoading = false;
        this.contextState.cartInfoLoading = false;
        this.forceUpdate();
      }
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

    setShippingMethod: async () => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartId = this.contextState.cart.id;
      const cartInfo = await setShippingMethodOnCart(
        this.getFullContext(),
        cartId
      );
      console.log("SET SHIPPING METHOD", cartInfo);
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

    createTestCart: async () => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const newCart = await createTestCart(this.getFullContext());
      localStorage.setItem(GUEST_CART_ID_STORAGE_KEY, newCart.id);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(newCart);
      return newCart;
    },

    mergeGuestCart: async () => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const guestCartId = localStorage.getItem(GUEST_CART_ID_STORAGE_KEY);
      const customerCartId = this.contextState.cart.id;
      console.log("GUEST ID", guestCartId);
      console.log("CUSTOMER CART ID", customerCartId);
      const newCart = await mergeGuestCart(
        this.getFullContext(),
        guestCartId,
        customerCartId
      );
      console.log("MERGE NEW CART", newCart);
      localStorage.removeItem(GUEST_CART_ID_STORAGE_KEY);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(newCart);
      return newCart;
    },

    setPaymentMethod: async (input: any) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const newCart = await setPaymentMethod(this.getFullContext(), input);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart(newCart);
      return newCart;
    },

    placeOrder: async () => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartId = this.contextState.cart.id;
      const order = await placeOrder(this.getFullContext(), cartId);
      console.log("PLACED ORDER", order);
      localStorage.setItem(ORDER_ID_STORAGE_KEY, order["order_number"]);
      localStorage.removeItem(GUEST_CART_ID_STORAGE_KEY);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart({});
      return order;
    },

    requestOrder: async () => {},
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
