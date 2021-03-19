import * as React from "react";
import {
  AddressT,
  CartT,
  CollectionCollaboratorT,
  CollectionT,
  CustomerT,
  OrderT,
} from "constants/types";
import { cloneDeep } from "lodash-es";
import { CartAddressInput } from "./CheckoutAPI/models";
import {
  CreateCustomerInput,
  CustomerAddressInput,
  UpdateCustomerInput,
} from "./CustomerAPI/models";
import { PaymentOption } from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";
import { AUTH_TOKEN_STORAGE_KEY } from "constants/general";
import {
  CollectionsQueryInput,
  CreateCollectionInput,
} from "./CollectionsAPI/models";
import { ProductsCache } from "./ProductsCache";

/**
 * This class is used for handling the Context's internal data.
 * All properties must be private and accessible ONLY through getters/setters
 * Getters and setters should usually use deepClone (unless necessary otherwise)
 * */
export enum Modals {
  Login = "login",
  RegisterOptions = "register-options",
  RegisterEmail = "register-email",
  AccountExists = "account-exists",
  UploadPhoto = "upload-photo",
  CreateCollection = "create-collection",
  DeleteCollection = "delete-collection",
  ShareCollection = "share-collection",
  DuplicateCollection = "duplicate-collection",
  MakePrivateCollection = "make-private-collection",
  None = "none",
}

abstract class BaseAppContextState {
  private internalCollaborators?: CollectionCollaboratorT = {};
  private internalCart?: CartT = {};
  private internalCartInfoLoading?: boolean = false;
  private internalCustomer?: CustomerT = {};
  private internalCustomerLoading?: boolean = false;
  private internalConfirmedOrder?: OrderT = {};
  private internalConfirmedOrderLoading: boolean = false;
  private internalIsLoggedIn?: boolean = !!localStorage.getItem(
    AUTH_TOKEN_STORAGE_KEY
  );
  private internalSelectedPaymentOption?: PaymentOption;
  private internalCollections?: CollectionT[] = [];
  private internalCollectionsLoading: boolean = false;
  private internalCollection?: CollectionT = {};
  private internalCollectionLoading: boolean = false;
  private modal?: Modals = Modals.None;
  private internalOrdersLoading?: boolean = false;

  private internalRecommendedProductSKUs: strng[] = [];
  private internalRecommendedProductSKUsLoading: boolean = false;

  public get collaborators() {
    return cloneDeep(this.internalCollaborators);
  }

  public set collaborators(newCollaborators) {
    this.internalCollaborators = newCollaborators;
  }

  public productsCache?: ProductsCache;

  public get cart() {
    return cloneDeep(this.internalCart);
  }

  public set cart(newCart: CartT) {
    this.internalCart = cloneDeep(newCart);
  }

  public get cartInfoLoading() {
    return !!this.internalCartInfoLoading;
  }

  public set cartInfoLoading(newValue: boolean) {
    this.internalCartInfoLoading = newValue;
  }

  public get isLoggedIn() {
    return !!this.internalIsLoggedIn;
  }

  public set isLoggedIn(newValue: boolean) {
    this.internalIsLoggedIn = newValue;
  }

  public setModalOpen(newValue: Modals) {
    this.modal = newValue;
  }

  public getModalOpen() {
    return this.modal;
  }

  public get customer() {
    return cloneDeep(this.internalCustomer);
  }

  public set customer(newCustomer: CustomerT) {
    this.internalCustomer = cloneDeep(newCustomer);
  }

  public get customerLoading() {
    return !!this.internalCustomerLoading;
  }

  public set customerLoading(newValue: boolean) {
    this.internalCustomerLoading = newValue;
  }

  public get selectedPaymentOption() {
    return this.internalSelectedPaymentOption;
  }

  public set selectedPaymentOption(newValue: PaymentOption) {
    this.internalSelectedPaymentOption = newValue;
  }

  public get confirmedOrder() {
    return cloneDeep(this.internalConfirmedOrder);
  }

  public set confirmedOrder(newOrder: OrderT) {
    this.internalConfirmedOrder = cloneDeep(newOrder);
  }

  public get confirmedOrderLoading() {
    return !!this.internalConfirmedOrderLoading;
  }

  public set confirmedOrderLoading(newValue: boolean) {
    this.internalConfirmedOrderLoading = newValue;
  }

  public setOrdersLoading(isLoading: boolean) {
    this.internalOrdersLoading = isLoading;
  }

  public isOrdersLoading() {
    return this.internalOrdersLoading;
  }

  public get collections() {
    return cloneDeep(this.internalCollections);
  }

  public set collections(newCollections: CollectionT[]) {
    this.internalCollections = cloneDeep(newCollections);
  }

  public get collectionsLoading() {
    return !!this.internalCollectionsLoading;
  }

  public set collectionsLoading(isLoading: boolean) {
    this.internalCollectionsLoading = isLoading;
  }

  public get collection() {
    return cloneDeep(this.internalCollection);
  }

  public set collection(newCollection: CollectionT) {
    this.internalCollection = cloneDeep(newCollection);
  }

  public get collectionLoading() {
    return !!this.internalCollectionLoading;
  }

  public set collectionLoading(isLoading: boolean) {
    this.internalCollectionLoading = isLoading;
  }

  public get recommendedProductSKUs() {
    return cloneDeep(this.internalRecommendedProductSKUs);
  }

  public set recommendedProductSKUs(newProducts: string[]) {
    this.internalRecommendedProductSKUs = cloneDeep(newProducts);
  }

  public get recommendedProductSKUsLoading() {
    return !!this.internalRecommendedProductSKUsLoading;
  }

  public set recommendedProductSKUsLoading(isLoading: boolean) {
    this.internalRecommendedProductSKUsLoading = isLoading;
  }
}

/**
 * By instantiating the BaseAppContextState and defining what context-manipulation
 * methods can be implemented, this class describes the 'shape' the context
 * which will be provided to consumers
 */
export class AppContextState extends BaseAppContextState {
  storeCollaborators(newCollaborator) {}

  async getCollaborators() {}

  updateCart(newCart: CartT) {}

  updateCustomer(newCustomer: CustomerT) {}

  setLoggedIn(newValue: boolean) {}

  setSelectedPaymentOption(newValue: PaymentOption) {}

  async requestCartInfo(cartId?: string) {}

  async requestCurrentCustomer(): Promise<CustomerT> {
    return Promise.resolve({});
  }

  async requestConfirmedOrder() {}

  async applyCouponToCart(couponCode: string) {}

  async removeCouponFromCart(couponCode: string) {}

  async createCustomerAddress(
    address: CustomerAddressInput
  ): Promise<AddressT> {
    return Promise.resolve({});
  }

  async updateCustomerAddress(
    id: number,
    address: CustomerAddressInput
  ): Promise<CustomerT> {
    return Promise.resolve({});
  }

  async setBillingAddress(
    sameAsShipping: boolean,
    address?: CartAddressInput
  ) {}

  async setShippingAddress(addressId: number) {}

  async setShippingMethod() {}

  async setPaymentMethod(input: any) {}

  async createCustomer(customer: CreateCustomerInput): Promise<CustomerT> {
    return Promise.resolve({});
  }

  async login(email: string, password: string) {}

  logout() {}

  openModal(modal: Modals) {}

  async createTestCart() {}

  async mergeGuestCart() {}

  async placeOrder() {}

  updateConfirmedOrder(newOrder: OrderT) {}

  async getOrders(): Promise<OrderT[]> {
    return Promise.resolve([]);
  }

  async updateCustomerV2(customer: UpdateCustomerInput) {}

  async changePassword(currentPassword: string, newPassword: string) {}

  async requestCollections(
    input: CollectionsQueryInput
  ): Promise<CollectionT[]> {
    return Promise.resolve([]);
  }

  async requestCollection(collectionId: number): Promise<CollectionT> {
    return Promise.resolve({});
  }

  async createCollection(input: CreateCollectionInput): Promise<CollectionT> {
    return Promise.resolve({});
  }

  async requestRecommendedProductSKUs(
    nrOfProducts: number,
    productSkus?: string[]
  ): Promise<string[]> {
    return Promise.resolve([]);
  }
}

export const AppContext = React.createContext(new AppContextState() as any);
