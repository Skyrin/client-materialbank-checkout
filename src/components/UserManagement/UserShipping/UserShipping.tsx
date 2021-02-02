import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import mockAddresses from "models/addressesMock.json";
import styles from "./UserShipping.module.scss";
import Address from "models/Address";
import MapAddressForm from "components/common/Forms/MapAddressForm/MapAddressForm";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import cn from "classnames";

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
  editingAddress: Address;
};

export default class UserShipping extends React.Component<Props, State> {
  targetElement = null;
  addAddressForm?: MapAddressForm;

  componentDidMount() {
    this.targetElement = document.querySelector("#modalId");
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }

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
      editingAddress: null,
    };
  }

  render() {
    return (
      <div>
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
                      <button
                        className={styles.makeDefault}
                        onClick={() => {
                          this.makeDefault(address);
                        }}
                      >
                        Make default
                      </button>
                    )}
                    {address.default && (
                      <button className={styles.defaultAddress}>
                        DEFAULT ADDRESS
                      </button>
                    )}

                    <button
                      className={styles.editAddressCell}
                      onClick={() => {
                        this.onEditClicked(address);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.mapContainer}>
              <div className={styles.addAddressContainer}>
                <MapAddressForm
                  componentRef={(ref) => {
                    this.addAddressForm = ref;
                  }}
                  onSave={(addressValues) => {
                    this.onSaveAddress(addressValues, null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          id={"modalId"}
          className={cn(styles.modalBackground, {
            [styles.visible]: this.state.editingAddress,
          })}
          onClick={(event) => {
            // @ts-ignore
            if (event.target.id === "modalId") {
              this.onModalBackgroundClicked();
            }
          }}
        >
          <div className={styles.modalContent}>
            <div
              className={cn("far fa-times", styles.closeModal)}
              onClick={() => {
                this.onModalBackgroundClicked();
              }}
            />
            <div className={cn(styles.mapContainer, styles.inModal)}>
              <div className={styles.addAddressContainer}>
                {this.state.editingAddress && (
                  <MapAddressForm
                    editAddress={this.state.editingAddress}
                    onCancelEdit={this.cancelEditAddress}
                    onSave={(addressValues, addressId) => {
                      this.onSaveAddress(addressValues, addressId);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onSaveAddress = (addressValues: AddressFormValuesT, addressId: string) => {
    const newAddress = new Address({
      id: addressId || Math.random(),
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

    if (newAddress.default) {
      const newAddresses = this.state.addresses.map((address) => {
        address.default = false;

        if (address.id === addressId) {
          address = newAddress;
        }

        return address;
      });

      if (!addressId) {
        newAddresses.push(newAddress);
      }
      this.setState({
        addresses: newAddresses,
      });
    } else {
      if (!addressId) {
        this.state.addresses.push(newAddress);
        this.setState({
          addresses: this.state.addresses,
        });
      } else {
        this.setState({
          addresses: this.state.addresses.map((address) => {
            if (address.id === addressId) {
              address = newAddress;
            }
            return address;
          }),
        });
      }
    }

    this.closeModal();
    this.addAddressForm.resetForm();
  };

  makeDefault = (defaultAddress: Address) => {
    const newAddresses = this.state.addresses.map((address) => {
      address.default = address.id === defaultAddress.id;
      return address;
    });
    this.setState({
      addresses: newAddresses,
    });
  };

  onEditClicked = (address: Address) => {
    this.setState({
      editingAddress: address,
    });
    this.disableWindowsScroll();
  };

  onModalBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      editingAddress: null,
    });
    this.enableWindowScroll();
  };

  cancelEditAddress = () => {
    this.closeModal();
  };

  disableWindowsScroll = () => {
    disableBodyScroll(this.targetElement);
  };

  enableWindowScroll = () => {
    enableBodyScroll(this.targetElement);
  };
}
