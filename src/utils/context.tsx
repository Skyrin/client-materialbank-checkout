// General utils for some common context operations

import { AddressT } from "constants/types";
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
