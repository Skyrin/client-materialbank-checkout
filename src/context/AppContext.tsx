import * as React from "react";
import { AddressT, CartT, CustomerT } from "constants/types";
import { cloneDeep } from "lodash-es";
import { CART_MOCK_DATA } from "./cartMockData";
import { CartAddressInput } from "./CheckoutAPI";
import { CreateCustomerInput, CustomerAddressInput } from "./CustomerAPI";
import { PaymentOption } from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";

/**
 * This class is used for handling the Context's internal data.
 * All properties must be private and accessible ONLY through getters/setters
 * Getters and setters should usually use deepClone (unless necessary otherwise)
 * */
abstract class BaseAppContextState {
  private internalCart?: CartT = CART_MOCK_DATA;
  private internalCartInfoLoading?: boolean = false;
  private internalCustomer?: CustomerT = {};
  private internalCustomerLoading?: boolean = false;
  private internalIsLoggedIn?: boolean = !!localStorage.getItem("token");
  private internalSelectedPaymentOption?: PaymentOption;

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

  async createCustomer(customer: CreateCustomerInput): Promise<CustomerT> {
    return Promise.resolve({});
  }

  async login(email: string, password: string) {}

  logout() {}
}

export const AppContext = React.createContext(new AppContextState() as any);
