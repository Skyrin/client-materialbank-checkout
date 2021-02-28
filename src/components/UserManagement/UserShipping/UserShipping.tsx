import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import styles from "./UserShipping.module.scss";
import Address from "models/Address";
import MapAddressForm from "components/common/Forms/MapAddressForm/MapAddressForm";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import cn from "classnames";
import { isOnMobile } from "../../../utils/responsive";
import { CustomerAddressInput } from "context/CustomerAPI/models";
import { AppContext, AppContextState } from "context/AppContext";
import { ClientError } from "GraphqlClient";
import Loader from "components/common/Loader/Loader";
import { AddressT } from "constants/types";

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
  addresses: AddressT[];
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
  editingAddress: Address;

  createAddressNetworkError: string;
};

export default class UserShipping extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;

  targetElement = null;
  addAddressForm?: MapAddressForm;

  componentDidMount() {
    this.targetElement = document.querySelector("#modalId");
    this.context.requestCurrentCustomer().then((value) => {
      this.setState({
        addresses: value.addresses,
      });
      console.log(value.addresses);
    });
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }

  constructor(props) {
    super(props);
    this.state = {
      values: DEFAULT_ADDRESS_VALUES,
      addresses: [],
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
      createAddressNetworkError: "",
    };
  }

  renderMobileMap = () => {
    return <div className={styles.map}></div>;
  };

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
                        {address.company}
                      </div>
                      <div className={styles.addressExtraDetails}>
                        {address.firstname + " " + address.lastname}
                      </div>
                      <div className={styles.addressExtraDetails}>
                        {address.street[0]}
                      </div>
                      <div className={styles.addressExtraDetails}>
                        {address.street[1]}
                      </div>
                      <div className={styles.addressExtraDetails}>
                        {address.city +
                          ", " +
                          address.region?.region_code +
                          " " +
                          address.postcode}
                      </div>
                    </div>

                    {!address.default_shipping && (
                      <button
                        className={styles.makeDefault}
                        onClick={() => {
                          this.makeDefault(address);
                        }}
                      >
                        Make default
                      </button>
                    )}
                    {address.default_shipping && (
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
            {isOnMobile() && this.renderMobileMap()}
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

        {this.context.customerLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
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

    const addressFields = {
      company: addressValues.nickname,
      firstName: addressValues.firstName || "",
      lastName: addressValues.lastName || "",
      city: addressValues.city || "",
      region: addressValues.state || "",
      address: addressValues.addressLine1 || [] || "",
      aptNumber: addressValues.addressLine2 || [] || "",
      zipCode: addressValues.zipcode || "",
      default_shipping: addressValues.default,
    };

    const addressInput = new CustomerAddressInput(addressFields);
    this.context
      .createCustomerAddress(addressInput)
      .then((value) => {
        console.log("GREAT SUCCESS");
        console.log(value);
        this.setState({
          addresses: value.addresses,
        });
      })
      .catch((error: ClientError) => {
        let errorMessage = error.graphqlErrors[0]?.message
          ? error.graphqlErrors[0].message
          : error.message;
      });

    // if (newAddress.default) {
    //   const newAddresses = this.state.addresses.map((address) => {
    //     address.default = false;
    //
    //     if (address.id === addressId) {
    //       address = newAddress;
    //     }
    //
    //     return address;
    //   });
    //
    //   if (!addressId) {
    //     newAddresses.push(newAddress);
    //   }
    //   this.setState({
    //     addresses: newAddresses,
    //   });
    // } else {
    //   if (!addressId) {
    //     this.state.addresses.push(newAddress);
    //     this.setState({
    //       addresses: this.state.addresses,
    //     });
    //   } else {
    //     this.setState({
    //       addresses: this.state.addresses.map((address) => {
    //         if (address.id === addressId) {
    //           address = newAddress;
    //         }
    //         return address;
    //       }),
    //     });
    //   }
    // }

    this.closeModal();
    this.addAddressForm.resetForm();
  };

  makeDefault = (defaultAddress: AddressT) => {
    // const newAddresses = this.state.addresses.map((address) => {
    //   address.default = address.id === defaultAddress.id;
    //   return address;
    // });
    // this.setState({
    //   addresses: newAddresses,
    // });
  };

  onEditClicked = (address: AddressT) => {
    // this.setState({
    //   editingAddress: address,
    // });
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
