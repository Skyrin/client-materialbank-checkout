import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import mockAddresses from "models/addressesMock.json";
import styles from "./UserShipping.module.scss";
import Address from "models/Address";
import cn from "classnames";

import Input from "components/common/Input/Input";
import Checkbox from "components/common/Checkbox/Checkbox";
import { extractErrors } from "utils/forms";
import MapAddressForm from "components/common/Forms/MapAddressForm/MapAddressForm";

export const DEFAULT_ADDRESS_VALUES: AddressFormValuesT = {
  nickname: "",
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipcode: "",
  default: false,
};

export type AddressFormValuesT = {
  nickname: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
  default: boolean;
};

export type AddressFormErrorsT = {
  nickname: string | null;
  firstName: string | null;
  lastName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
};

type Props = RouteComponentProps;

type State = {
  addresses: Address[];
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
};

export default class UserShipping extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      values: DEFAULT_ADDRESS_VALUES,
      addresses: mockAddresses.map((address) => new Address(address)),
      errors: {
        nickname: null,
        firstName: null,
        lastName: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        zipcode: null,
      },
    };
  }

  render() {
    return (
      <div className={styles.UserShipping}>
        <UserHeader
          title={UserPages.Shipping.name}
          extraContent={
            <SearchBar
              placeholder={"Search of shipping address"}
              onSearchChange={(value: string) => {
                console.log(value);
              }}
            />
          }
        />
        <div className={styles.pageContent}>
          <div className={styles.addressGrid}>
            {this.state.addresses.map((address) => {
              return (
                <div className={styles.addressCell} key={address.id}>
                  <div className={styles.addressMapCell} />
                  <div className={styles.addressInfo}>
                    <div className={styles.addressNickName}>
                      {address.nickname}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.firstName + " " + address.lastName}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.addressLine1}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.addressLine2}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.city +
                        ", " +
                        address.state +
                        " " +
                        address.zipcode}
                    </div>
                  </div>

                  {!address.default && (
                    <button className={styles.makeDefault}>Make default</button>
                  )}
                  {address.default && (
                    <button className={styles.defaultAddress}>
                      DEFAULT ADDRESS
                    </button>
                  )}

                  <button className={styles.editAddressCell}>Edit</button>
                </div>
              );
            })}
          </div>

          <div className={styles.mapContainer}>
            <div className={styles.addAddressContainer}>
              <MapAddressForm
                onSave={(addressValues) => {
                  this.onSaveAddress(addressValues);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  onSaveAddress = (addressValues: AddressFormValuesT) => {
    const address = new Address({
      id: Math.random(),
      nickname: addressValues.nickname,
      firstName: addressValues.firstName,
      lastName: addressValues.lastName,
      addressLine1: addressValues.addressLine1,
      addressLine2: addressValues.addressLine2,
      city: addressValues.city,
      state: addressValues.state,
      zipcode: addressValues.zipcode,
      default: addressValues.default,
    });

    if (address.default) {
      const newAddresses = this.state.addresses.map((address) => {
        address.default = false;
        return address;
      });
      newAddresses.push(address);
      this.setState({
        addresses: newAddresses,
      });
    }

    console.log(address);
  };
}
