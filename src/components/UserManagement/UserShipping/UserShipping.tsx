import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import styles from "./UserShipping.module.scss";
import MapAddressForm, {
  AddressFormErrorsT,
  AddressFormValuesT,
  DEFAULT_ADDRESS_VALUES,
} from "components/common/Forms/MapAddressForm/MapAddressForm";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import cn from "classnames";
import { CustomerAddressInput } from "context/CustomerAPI/models";
import { AppContext, AppContextState } from "context/AppContext";
import { ClientError } from "GraphqlClient";
import Loader from "components/common/Loader/Loader";
import { AddressT, CustomerT } from "constants/types";
import ErrorLabel from "components/common/ErrorLabel/ErrorLabel";
import { isOnMobile } from "utils/responsive";

type Props = RouteComponentProps;

type State = {
  customer: CustomerT;
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
        customer: value,
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
      customer: null,
      errors: {
        company: null,
        firstName: null,
        lastName: null,
        address: null,
        aptNumber: null,
        city: null,
        region: null,
        zipCode: null,
      },
      editingAddress: null,
      createAddressNetworkError: "",
      editAddressNetworkError: "",
    };
  }

  renderAddressGrid = () => {
    return (
      <div>
        <div className={styles.title}>Your Addresses</div>
        <div className={styles.addressGrid}>
          {this.state.addresses.map((address) => {
            return (
              <div className={styles.addressCell} key={address.id}>
                <div className={"row center-vertically"}>
                  <div className={styles.addressNickName}>
                    {address.company}
                  </div>

                  {address.default_shipping && (
                    <div className={styles.defaultAddress}>DEFAULT</div>
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

                <div className={styles.addressInfoContainer}>
                  <div className={styles.addressInfo}>
                    <div className={styles.addressExtraDetails}>
                      {address.firstname}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.lastname}
                    </div>
                  </div>

                  <div className={styles.addressInfo}>
                    <div className={styles.addressExtraDetails}>
                      {address.street[0]}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.street[1]}
                    </div>
                  </div>

                  <div className={styles.addressInfo}>
                    <div className={styles.addressExtraDetails}>
                      {address.city + ", "}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.region?.region_code}
                    </div>
                    <div className={styles.addressExtraDetails}>
                      {address.postcode}
                    </div>
                  </div>
                </div>

                {isOnMobile() && this.state.editingAddress?.id === address.id && (
                  <MapAddressForm
                    className={cn(styles.mobileEditAddress, {
                      [styles.visible]:
                        this.state.editingAddress?.id === address.id,
                    })}
                    editAddress={{
                      id: address?.id,
                      city: address?.city,
                      company: address?.company,
                      firstname: address?.firstname,
                      lastname: address?.lastname,
                      postcode: address?.postcode,
                      street: address?.street, // Probably [address_line_1, address_line_2]. in our case, we should probably just do [address]. TODO: clarify this
                      telephone: address?.telephone,
                      region: address?.region,
                      default_billing: address?.default_billing,
                      default_shipping: address?.default_shipping,
                    }}
                    onCancelEdit={this.cancelEditAddress}
                    onSave={(addressValues, addressId) => {
                      this.onSaveAddress(addressValues, addressId);
                    }}
                    onDelete={(addressId) => {
                      this.deleteAddress(addressId);
                    }}
                  />
                )}
                {this.state.editAddressNetworkError &&
                  this.state.editingAddress?.id === address.id &&
                  isOnMobile() && (
                    <ErrorLabel
                      className={styles.errorCreateAddress}
                      errorText={this.state.editAddressNetworkError}
                    />
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderAddAddress = () => {
    return (
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
    );
  };

  render() {
    return (
      <div>
        <div className={styles.UserShipping}>
          {!this.context.customerLoading && (
            <UserHeader
              title={UserPages.Shipping.name}
              customer={this.state.customer}
            />
          )}
          <div className={styles.pageContent}>
            {this.renderAddressGrid()}
            {this.renderAddAddress()}
          </div>
        </div>

        <div
          id={"modalId"}
          className={cn(styles.modalBackground, {
            [styles.visible]: this.state.editingAddress && !isOnMobile(),
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
            <div
              className={cn(styles.editAddressFormContainer, styles.inModal)}
            >
              <div>
                {this.state.editingAddress && (
                  <MapAddressForm
                    editAddress={this.state.editingAddress}
                    onCancelEdit={this.cancelEditAddress}
                    onSave={(addressValues, addressId) => {
                      this.onSaveAddress(addressValues, addressId);
                    }}
                    onDelete={(addressId) => {
                      this.deleteAddress(addressId);
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

  deleteAddress(addressId: number) {
    this.setState({
      createAddressNetworkError: "",
      editAddressNetworkError: "",
    });

    this.context
      .deleteCustomerAddress(addressId)
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
  }

  onSaveAddress = (addressValues: AddressFormValuesT, addressId: number) => {
    this.setState({
      createAddressNetworkError: "",
      editAddressNetworkError: "",
    });

    const addressFields = {
      ...addressValues,
      default_shipping: addressValues.default,
      default_billing: addressValues.default,
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

  onEditClicked = (address: AddressT) => {
    if (address.id !== this.state.editingAddress?.id) {
      this.setState({
        editingAddress: address,
        editAddressNetworkError: null,
      });
    } else {
      this.setState({
        editingAddress: null,
        editAddressNetworkError: null,
      });
    }
    if (!isOnMobile()) {
      this.disableWindowsScroll();
    }
  };

  onModalBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      editingAddress: null,
      editAddressNetworkError: null,
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
