import * as React from "react";
import {
  AddressT,
  CartT,
  CollectionCollaboratorT,
  CollectionHotspotT,
  CollectionT,
  CustomerT,
  HotspotT,
  OrderT,
  StoredPaymentMethodT,
} from "constants/types";
import { clone, cloneDeep } from "lodash-es";
import { CartAddressInput } from "./CheckoutAPI/models";
import {
  CreateCustomerInput,
  CustomerAddressInput,
  UpdateCustomerInput,
} from "./CustomerAPI/models";
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
  DeleteItem = "delete-item",
  ShareCollection = "share-collection",
  DuplicateCollection = "duplicate-collection",
  MakePrivateCollection = "make-private-collection",
  AddSample = "add-sample",
  None = "none",
}

abstract class BaseAppContextState {
  private internalHotspots?: CollectionHotspotT[] = [];
  private internalHotspot?: HotspotT = {};
  private internalCollaborators?: CollectionCollaboratorT = {};
  private internalCart?: CartT = {};
  private internalCartInfoLoading?: boolean = false;
  private internalUpdatingCartInfo?: boolean = false;
  private internalCustomer?: CustomerT = {};
  private internalCustomerLoading?: boolean = false;
  private internalStoredPaymentMethods?: StoredPaymentMethodT[] = [];
  private internalConfirmedOrder?: OrderT = {};
  private internalConfirmedOrderLoading: boolean = false;
  private internalIsLoggedIn?: boolean = !!localStorage.getItem(
    AUTH_TOKEN_STORAGE_KEY
  );
  private internalCollections?: CollectionT[] = [];
  private internalCollectionsLoading: boolean = false;
  private internalCollection?: CollectionT = {};
  private internalCollectionLoading: boolean = false;
  private modal?: Modals = Modals.None;
  private modalParams?: Object = {};
  private internalOrdersLoading?: boolean = false;

  private internalRecommendedProductSKUs: string[] = [];
  private internalRecommendedProductSKUsLoading: boolean = false;

  private internalOrderSummaryOpen: boolean = false;

  public get hotspots() {
    return cloneDeep(this.internalHotspots);
  }

  public set hotspots(newHotspots) {
    this.internalHotspots = newHotspots;
  }

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

  public get updatingCartInfo() {
    return this.internalUpdatingCartInfo;
  }

  public set updatingCartInfo(newValue: boolean) {
    this.internalUpdatingCartInfo = newValue;
  }

  public get isLoggedIn() {
    return !!this.internalIsLoggedIn;
  }

  public set isLoggedIn(newValue: boolean) {
    this.internalIsLoggedIn = newValue;
  }

  public setModalOpen(newValue: Modals, modalParams = {}) {
    this.modal = newValue;
    // Pass the params by reference to make sure that callbacks are still part of the original component
    this.modalParams = modalParams;
  }

  public getModalOpen() {
    return this.modal;
  }

  public getModalParams() {
    return this.modalParams;
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

  public get storedPaymentMethods() {
    return cloneDeep(this.internalStoredPaymentMethods);
  }

  public set storedPaymentMethods(newMethods: StoredPaymentMethodT[]) {
    this.internalStoredPaymentMethods = cloneDeep(newMethods);
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

  public get hotspot() {
    return cloneDeep(this.internalHotspot);
  }

  public set hotspot(newHotspot: HotspotT) {
    this.internalHotspot = cloneDeep(newHotspot);
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

  public get orderSummaryOpen() {
    return this.internalOrderSummaryOpen;
  }

  public set orderSummaryOpen(newValue: boolean) {
    this.internalOrderSummaryOpen = newValue;
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

  storeHotspots(newHotspot) {}

  async getHotspots() {}

  updateCart(newCart: CartT) {}

  updateCustomer(newCustomer: CustomerT) {}

  setLoggedIn(newValue: boolean) {}

  async requestCartInfo(cartId?: string) {}

  async requestCurrentCustomer(): Promise<CustomerT> {
    return Promise.resolve({});
  }

  async requestConfirmedOrder() {}

  async applyCouponToCart(couponCode: string) {}

  async removeCouponFromCart(couponCode: string) {}

  async createCustomerAddress(
    address: CustomerAddressInput,
    isDefault?: boolean
  ): Promise<AddressT> {
    return Promise.resolve({});
  }

  async updateCustomerAddress(
    id: number,
    address: CustomerAddressInput
  ): Promise<CustomerT> {
    return Promise.resolve({});
  }

  async deleteCustomerAddress(id: number): Promise<CustomerT> {
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

  openModal(modal: Modals, modalParams: Object = {}) {}

  closeModal() {}

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

  setOrderSummaryOpen(newValue: boolean) {}

  async changeCartItemQuantity(sku: string, newQuantity: number) {}

  async requestHotspots(input: CollectionsQueryInput): Promise<CollectionT[]> {
    return Promise.resolve([]);
  }

  async requestHotspot(hotspotId: number): Promise<CollectionT> {
    return Promise.resolve({});
  }
}

export const AppContext = React.createContext(new AppContextState() as any);
