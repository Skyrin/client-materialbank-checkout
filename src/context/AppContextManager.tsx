import {
  CartT,
  CollectionCollaboratorT,
  CollectionT,
  CustomerT,
  OrderT,
} from "constants/types";
import * as React from "react";
import { AppContext, AppContextState, Modals } from "./AppContext";
import { cloneDeep, isArray, isString, merge, mergeWith, get } from "lodash-es";
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
  changeCustomerPassword,
  createCustomer,
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerOrders,
  login,
  requestCurrentCustomer,
  requestOrder,
  updateCustomerAddress,
  updateCustomerV2,
} from "./CustomerAPI/api";
import {
  CreateCustomerInput,
  CustomerAddressInput,
  UpdateCustomerInput,
} from "./CustomerAPI/models";
import { PaymentOption } from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";
import {
  AUTH_TOKEN_STORAGE_KEY,
  GUEST_CART_ID_STORAGE_KEY,
  ORDER_ID_STORAGE_KEY,
  ORDER_NUMBER_STORAGE_KEY,
} from "constants/general";
import {
  CollectionsQueryInput,
  CreateCollectionInput,
} from "./CollectionsAPI/models";
import {
  createCollection,
  getCollection,
  getCollections,
} from "./CollectionsAPI/api";
import { ProductsCache } from "./ProductsCache";
import { algoliaProducts } from "algolia";

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
    storeCollaborators: (persons: CollectionCollaboratorT) => {
      this.contextState.collaborators = persons;
    },

    getCollaborators: async () => {
      return this.contextState.collaborators;
    },

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

    updateConfirmedOrder: (newOrder: OrderT) => {
      this.contextState.confirmedOrder = mergeWith(
        this.contextState.confirmedOrder,
        newOrder,
        fieldCustomizer
      );
      this.forceUpdate();
      return this.contextState.confirmedOrder;
    },

    updateCollections: (newCollections: CollectionT[]) => {
      this.contextState.collections = newCollections;
      this.forceUpdate();
      return this.contextState.collections;
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
        try {
          cartInfo = await requestCustomerCartInfo(this.getFullContext());
        } catch (e) {
          console.log("error ");
        }
      } else {
        cartInfo = await requestGuestCartInfo(
          this.getFullContext(),
          cartId || ""
        );
      }
      console.log("GOT CART INFO", cartInfo);
      this.contextState.cartInfoLoading = false;
      if (cartInfo) {
        this.actions.updateCart(cartInfo);
        return this.contextState.cart;
      } else {
        console.log("error ");
      }
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
        if (localStorage.getItem(GUEST_CART_ID_STORAGE_KEY)) {
          await this.actions.mergeGuestCart();
        }
        return customer;
      } else {
        console.log("error ");
      }
    },

    openModal: (modal: Modals, modalParams: Object = {}) => {
      this.contextState.setModalOpen(modal, modalParams);
      this.forceUpdate();
    },

    closeModal: () => {
      this.contextState.setModalOpen(Modals.None, {});
      this.forceUpdate();
    },

    logout: async () => {
      // TODO: Figure out what else we might need to do here
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      this.contextState.isLoggedIn = false; // Change directly here so we don't trigger 2 updates
      this.contextState.customer = {};
      this.contextState.cart = {};
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

    updateCustomerV2: async (customer: UpdateCustomerInput) => {
      this.contextState.customerLoading = true;
      this.forceUpdate();
      try {
        await updateCustomerV2(this.getFullContext(), customer);
      } catch (e) {
        throw e;
      } finally {
        this.contextState.customerLoading = false;
        this.forceUpdate();
      }
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      this.contextState.customerLoading = true;
      this.forceUpdate();
      try {
        await changeCustomerPassword(
          this.getFullContext(),
          currentPassword,
          newPassword
        );
      } catch (e) {
        throw e;
      } finally {
        this.contextState.customerLoading = false;
        this.forceUpdate();
      }
    },

    applyCouponToCart: async (couponCode: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      try {
        const cartId = this.contextState.cart.id;
        const cartInfo = await applyCouponToCart(
          this.getFullContext(),
          cartId,
          couponCode
        );
        console.log("COUPON", cartInfo);
        this.actions.updateCart(cartInfo);
        return this.contextState.cart;
      } catch (e) {
        throw e;
      } finally {
        this.contextState.cartInfoLoading = false;
        this.forceUpdate();
      }
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

    createCustomerAddress: async (
      address: CustomerAddressInput,
      isDefault?: boolean
    ) => {
      this.contextState.customerLoading = true;
      this.forceUpdate();
      try {
        if (isDefault) {
          address.default_shipping = true;
        }
        const resp = await createCustomerAddress(
          this.getFullContext(),
          address
        );
        await this.actions.requestCurrentCustomer();
        return resp;
      } catch (e) {
        throw e;
      } finally {
        this.contextState.customerLoading = false;
        this.forceUpdate();
      }
    },

    updateCustomerAddress: async (
      id: number,
      address: CustomerAddressInput
    ) => {
      this.contextState.customerLoading = true;
      this.forceUpdate();
      try {
        await updateCustomerAddress(this.getFullContext(), id, address);
        return await this.actions.requestCurrentCustomer();
      } catch (e) {
        throw e;
      } finally {
        this.contextState.customerLoading = false;
        this.forceUpdate();
      }
    },

    deleteCustomerAddress: async (id: number) => {
      this.contextState.customerLoading = true;
      this.forceUpdate();

      try {
        await deleteCustomerAddress(this.getFullContext(), id);
        return await this.actions.requestCurrentCustomer();
      } catch (e) {
        throw e;
      } finally {
        this.contextState.customerLoading = false;
        this.forceUpdate();
      }
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
      if (guestCartId === customerCartId) {
        this.contextState.cartInfoLoading = false;
        localStorage.removeItem(GUEST_CART_ID_STORAGE_KEY);
        this.forceUpdate();
        return this.contextState.cart;
      }
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
      sessionStorage.setItem(ORDER_NUMBER_STORAGE_KEY, order["order_number"]);
      localStorage.removeItem(GUEST_CART_ID_STORAGE_KEY);
      this.contextState.cartInfoLoading = false;
      this.actions.updateCart({});
      return order;
    },

    requestConfirmedOrder: async () => {
      // This is so ridiculous...
      // The graphql placeOrder mutation returns an order number
      // But the REST call that we need to use for Stripe returns an order id
      // Then...
      // There is no way of retrieving the order directly by id
      // So we need to get the entire list and find it ourselves
      const orderNumber = sessionStorage.getItem(ORDER_NUMBER_STORAGE_KEY);
      const orderId = sessionStorage.getItem(ORDER_ID_STORAGE_KEY);
      if (orderNumber) {
        this.contextState.confirmedOrderLoading = true;
        this.forceUpdate();
        const order = await requestOrder(this.context, orderNumber);
        console.log("GOT ORDER", order);
        this.contextState.confirmedOrderLoading = false;
        this.actions.updateConfirmedOrder(order);
        return this.contextState.confirmedOrder;
      }

      if (orderId) {
        this.contextState.confirmedOrderLoading = true;
        this.forceUpdate();
        const orders = await getCustomerOrders(this.context);
        const foundOrder = orders.items.find(
          (order) => orderId === atob(order.id)
        );
        if (foundOrder) {
          this.contextState.confirmedOrderLoading = false;
          this.actions.updateConfirmedOrder(foundOrder);
          return this.contextState.confirmedOrder;
        }
      }
    },

    getOrders: async () => {
      this.contextState.setOrdersLoading(true);
      this.forceUpdate();
      const orders = await getCustomerOrders(this.getFullContext());
      this.contextState.setOrdersLoading(false);
      this.forceUpdate();
      console.log("GOT ORDERS", orders);
      return orders["items"];
    },

    requestCollections: async (input: CollectionsQueryInput) => {
      this.contextState.collectionsLoading = true;
      this.forceUpdate();
      const collections = await getCollections(this.getFullContext(), input);
      this.contextState.collectionsLoading = false;
      this.actions.updateCollections(collections);
      console.log("GOT COLLECTIONS", collections);
      return collections;
    },

    requestCollection: async (collectionId: number) => {
      this.contextState.collectionLoading = true;
      this.forceUpdate();
      const collection = await getCollection(
        this.getFullContext(),
        collectionId
      );
      this.contextState.collectionLoading = false;
      this.contextState.collection = collection;
      console.log("GOT COLLECTION", collection);
      return collection;
    },

    createCollection: async (input: CreateCollectionInput) => {
      const newCollection = await createCollection(
        this.getFullContext(),
        input.name,
        input.isPublic
      );
      this.actions.requestCollections({ limit: 100, offset: 0 });
      return newCollection;
    },

    productsCache: new ProductsCache(() => {
      this.forceUpdate();
    }),

    requestRecommendedProductSKUs: async (
      nrOfProducts: number,
      productSkus?: string[]
    ) => {
      this.contextState.recommendedProductsLoading = true;
      this.forceUpdate();
      const skus =
        productSkus || this.contextState.cart.items.map((p) => p.product.sku);
      console.log("[REC] REQUESTING ALGOLIA CARD PRODUCTS", skus);
      const algProducts = await this.getFullContext().productsCache.getProductsAsync(
        skus
      );
      console.log("[REC] ALGOLIA CART PRODUCTS", algProducts);
      const manufacturersSet = new Set<string>();
      algProducts
        .filter((ap) => !ap.loading)
        .forEach((ap) => manufacturersSet.add(ap.data.manufacturer));
      console.log("[REC] MANUFACTURERS SET", manufacturersSet);
      const manufacturers = [...manufacturersSet];
      const manufacturersFilter = manufacturers.map(
        (man) => `manufacturer:${man}`
      );
      console.log("[REC] MANUFACTURERS FILTER", manufacturersFilter);
      // Exclude the already added products from the result
      const skuFilter = skus.map((sku) => `sku:-${sku}`);
      console.log("[REC] SKU FILTER", skuFilter);
      const options = {
        facetFilters: [manufacturersFilter, ...skuFilter, "type_id:simple"],
        hitsPerPage: nrOfProducts,
      };
      console.log("[REC] ALGOLIA OPTIONS", options);
      const resp = await algoliaProducts.search("", options);
      console.log("[REC] ALGOLIA RESPONSE", resp);
      const hits = get(resp, "hits", []);
      console.log("[REC] ALGOLIA HITS", hits);
      hits.forEach((hit) => {
        this.getFullContext().productsCache.products.set(hit.sku, {
          loading: false,
          data: hit,
        });
      });
      const recommendedSkus = hits.map((hit) => hit.sku);
      this.contextState.recommendedProductSKUs = recommendedSkus;
      this.contextState.requestRecommendedProductSKUsLoading = false;
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
