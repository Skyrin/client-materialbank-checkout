import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import styles from "./UserShipping.module.scss";
import MapAddressForm from "components/common/Forms/MapAddressForm/MapAddressForm";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import cn from "classnames";
import { isOnMobile } from "utils/responsive";
import { CustomerAddressInput } from "context/CustomerAPI/models";
import { AppContext, AppContextState } from "context/AppContext";
import { ClientError } from "GraphqlClient";
import Loader from "components/common/Loader/Loader";
import { AddressT } from "constants/types";
import ErrorLabel from "components/common/ErrorLabel/ErrorLabel";

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
  editingAddress: AddressT;

  createAddressNetworkError: string;
  editAddressNetworkError: string;
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
      editAddressNetworkError: "",
    };
  }

  renderMobileMap = () => {
    return <div className={styles.map} />;
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
                onSearchChange={() => {}}
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
                {this.state.createAddressNetworkError && (
                  <ErrorLabel
                    className={styles.errorCreateAddress}
                    errorText={this.state.createAddressNetworkError}
                  />
                )}
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
                {this.state.editAddressNetworkError && (
                  <ErrorLabel
                    className={styles.errorCreateAddress}
                    errorText={this.state.editAddressNetworkError}
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

  onSaveAddress = (addressValues: AddressFormValuesT, addressId: number) => {
    this.setState({
      createAddressNetworkError: "",
      editAddressNetworkError: "",
    });

    const addressFields = {
      company: addressValues.nickname,
      firstName: addressValues.firstName || "",
      lastName: addressValues.lastName || "",
      city: addressValues.city || "",
      region: addressValues.state || "",
      address: addressValues.addressLine1 || "",
      aptNumber: addressValues.addressLine2 || "",
      zipCode: addressValues.zipcode || "",
      default_shipping: addressValues.default,
    };

    const addressInput = new CustomerAddressInput(addressFields);

    if (addressId) {
      this.context
        .updateCustomerAddress(addressId, addressInput)
        .then((value) => {
          this.setState({
            addresses: value?.addresses,
          });
          this.closeModal();
        })
        .catch((error: ClientError) => {
          let errorMessage = error.graphqlErrors[0]?.message
            ? error.graphqlErrors[0].message
            : error.message;

          this.setState({
            editAddressNetworkError: errorMessage,
          });
        });
    } else {
      this.context
        .createCustomerAddress(addressInput)
        .then((value) => {
          console.log("CREATED ADDRESS", value);
          return this.context.requestCurrentCustomer();
        })
        .then((value) => {
          this.setState({
            addresses: value?.addresses,
          });
          this.addAddressForm.resetForm();
        })
        .catch((error: ClientError) => {
          let errorMessage = error.graphqlErrors[0]?.message
            ? error.graphqlErrors[0].message
            : error.message;

          this.setState({
            createAddressNetworkError: errorMessage,
          });
        });
    }
  };

  makeDefault = (defaultAddress: AddressT) => {
    const addressFields = {
      company: defaultAddress.company,
      firstName: defaultAddress.firstname || "",
      lastName: defaultAddress.lastname || "",
      city: defaultAddress.city || "",
      region: defaultAddress.region.region_code || "",
      address: defaultAddress.street[0] || "",
      aptNumber: defaultAddress.street[1] || "",
      zipCode: defaultAddress.postcode || "",
      default_shipping: true,
      telephone: "123123",
    };

    const addressInput = new CustomerAddressInput(addressFields);

    this.context
      .updateCustomerAddress(defaultAddress.id, addressInput)
      .then((value) => {
        this.setState({
          addresses: value?.addresses,
        });
      })
      .catch(() => {});
  };

  onEditClicked = (address: AddressT) => {
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
