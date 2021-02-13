import * as React from "react";
import { AddressT, CartT, CustomerT } from "constants/types";
import { cloneDeep } from "lodash-es";
import { CartAddressInput } from "./CheckoutAPI/models";
import {
  CreateCustomerInput,
  CustomerAddressInput,
} from "./CustomerAPI/models";
import { PaymentOption } from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";
import { AUTH_TOKEN_STORAGE_KEY } from "constants/general";

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
  None = "none",
}

abstract class BaseAppContextState {
  private internalCart?: CartT = {};
  private internalCartInfoLoading?: boolean = false;
  private internalCustomer?: CustomerT = {};
  private internalCustomerLoading?: boolean = false;
  private internalIsLoggedIn?: boolean = !!localStorage.getItem(
    AUTH_TOKEN_STORAGE_KEY
  );
  private internalSelectedPaymentOption?: PaymentOption;

  private modal?: Modals = Modals.None;

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
}

/**
 * By instantiating the BaseAppContextState and defining what context-manipulation
 * methods can be implemented, this class describes the 'shape' the context
 * which will be provided to consumers
 */
export class AppContextState extends BaseAppContextState {
  updateCart(newCart: CartT) {}

  updateCustomer(newCustomer: CustomerT) {}

  setLoggedIn(newValue: boolean) {}

  setSelectedPaymentOption(newValue: PaymentOption) {}

  async requestCartInfo(cartId?: string) {}

  async requestCurrentCustomer() {}

  async requestOrder(orderId?: string) {}

  async applyCouponToCart(couponCode: string) {}

  async removeCouponFromCart(couponCode: string) {}

  async createCustomerAddress(
    address: CustomerAddressInput
  ): Promise<AddressT> {
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
}

export const AppContext = React.createContext(new AppContextState() as any);
