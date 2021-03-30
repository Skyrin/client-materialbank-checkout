// General utils for some common context operations

import { getRegionFromName } from "constants/regions";
import { AddressT, OrderAddressT, OrderItemT, OrderT } from "constants/types";
import { AppContextState } from "context/AppContext";
import { isEqual } from "lodash";

export const getAddressId = (context: AppContextState, address: AddressT) => {
  // Gets the customer addressId for a given address.
  // This is needed because Magento, for some reason, only returns this ID on the customer->addresses field
  // even if the cart shipping/billing address was set using customer_address_id.

  const customerAddresses = context.customer?.addresses || [];

  const addressStreet =
    address.street ||
    (address.aptName ? [address.address, address.aptName] : [address.address]);
  const foundAddress = customerAddresses.find((customerAddress) => {
    if (address.city !== customerAddress.city) return false;
    if (
      (address.region.code || address.region) !==
      customerAddress.region.region_code
    )
      return false;
    if ((address.firstname || address.firstName) !== customerAddress.firstname)
      return false;
    if ((address.lastname || address.lastName) !== customerAddress.lastname)
      return false;
    if (!isEqual(addressStreet, customerAddress.street)) return false;
    return true;
  });
  if (foundAddress) {
    return foundAddress.id;
  }
  return -1;
};

export const parseRESTAddress = (restAddress: any) => {
  const result: OrderAddressT = {};
  result.id = restAddress.id;
  result.firstname = restAddress.firstname;
  result.lastname = restAddress.lastname;
  result.city = restAddress.city;
  result.company = restAddress.company;
  result.postcode = restAddress.postalCode;
  result.street = [restAddress.street1, restAddress.street2].filter((c) => c);
  result.telephone = restAddress.phone;
  result.region = getRegionFromName(restAddress.state).code;
  return result;
};

export const parseRESTOrderItem = (restProduct: any) => {
  const result: OrderItemT = {};
  result.product_sku = restProduct.sku;
  result.product_name = restProduct.name;
  result.id = restProduct.id;
  result.product_sale_price = {
    currency: "USD",
    value: restProduct.price,
  };
  result.quantity_invoiced = parseInt(restProduct.qtyInvoiced, 10);
  result.quantity_ordered = parseInt(restProduct.qtyOrdered, 10);
  return result;
};

export const parseRESTOrder = (restOrder: any) => {
  const result: OrderT = {};
  result.number = restOrder.number;
  result.order_date = restOrder.createdAt;
  result.status = restOrder.status;
  const restBillingAddress = restOrder.address.find(
    (addr) => addr.type === "billing"
  );
  result.billing_address = parseRESTAddress(restBillingAddress);
  const restShippingAddress = restOrder.address.find(
    (addr) => addr.type === "shipping"
  );
  result.shipping_address = parseRESTAddress(restShippingAddress);
  result.payment = restOrder.payment;
  result.total = {
    grand_total: {
      currency: "USD",
      value: parseFloat(restOrder.total),
    },
    subtotal: {
      currency: "USD",
      value: parseFloat(restOrder.subtotal),
    },
    total_shipping: {
      currency: "USD",
      value: parseFloat(restOrder.shipping),
    },
    total_tax: {
      currency: "USD",
      value: parseFloat(restOrder.tax),
    },
  };
  result.items = (restOrder.products || []).map((prod) =>
    parseRESTOrderItem(prod)
  );
  return result;
};
