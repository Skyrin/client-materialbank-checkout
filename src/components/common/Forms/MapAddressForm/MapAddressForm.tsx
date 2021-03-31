import * as React from "react";
import styles from "./MapAddressForm.module.scss";
import Input from "components/common/Input/Input";
import cn from "classnames";
import Checkbox from "components/common/Checkbox/Checkbox";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import Select from "react-dropdown-select";
import usaStates from "models/usaStates.json";
import styled from "@emotion/styled";
import { AddressT } from "constants/types";
import AddressInput from "components/common/Input/AddressInput/AddressInput";

const addAddressSchema = yup.object().shape({
  company: yup.string().required("Required"),
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  address: yup.string().required("Required"),
  city: yup.string().required("Required"),
  region: yup.string().required("Required"),
  zipCode: yup.string().required("Required"),
});

export const DEFAULT_ADDRESS_VALUES: AddressFormValuesT = {
  company: "",
  firstName: "",
  lastName: "",
  address: "",
  aptNumber: "",
  city: "",
  region: usaStates[0].abbreviation,
  zipCode: "",
  default: false,
};

export type AddressFormValuesT = {
  company: string;
  firstName: string;
  lastName: string;
  address: string;
  aptNumber: string;
  city: string;
  region: string;
  zipCode: string;
  default: boolean;
};

export type AddressFormErrorsT = {
  company: string | null;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  aptNumber: string | null;
  city: string | null;
  region: string | null;
  zipCode: string | null;
};

const NO_ERRORS = {
  firstName: null,
  lastName: null,
  company: null,
  address: null,
  aptNumber: null,
  city: null,
  zipCode: null,
  phone: null,
  region: null,
};

type Props = {
  editAddress?: AddressT;
  initialValues?: AddressFormValuesT;
  componentRef?: (ref: MapAddressForm) => void;
  onCancelEdit?: () => void;
  onSave?: (addressValues: AddressFormValuesT, addressId?: number) => void;
  onDelete?: (addressId?: number) => void;
  className?: any;
};

type State = {
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
  editMode: boolean;
};

export default class MapAddressForm extends React.Component<Props, State> {
  addressInputRef: AddressInput;

  constructor(props) {
    super(props);
    let initialValues: AddressFormValuesT = DEFAULT_ADDRESS_VALUES;

    if (props.editAddress) {
      initialValues = {
        company: props.editAddress.company,
        firstName: props.editAddress.firstname,
        lastName: props.editAddress.lastname,
        address: props.editAddress.street[0],
        aptNumber: props.editAddress.street[1],
        city: props.editAddress.city,
        region: props.editAddress.region.region_code,
        zipCode: props.editAddress.postcode,
        default: props.editAddress.default_shipping,
      };
    }

    this.state = {
      values: initialValues,
      editMode: !!this.props.initialValues,
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
    };

    if (props.componentRef) {
      props.componentRef(this);
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <div
          className={cn(styles.title, {
            [styles.editing]: this.props.editAddress,
          })}
        >
          {this.props.editAddress && `Editing "${this.state.values.company}"`}
          {!this.props.editAddress && "Add a New Address"}
        </div>
        <div className={styles.addressForm}>
          <div className={styles.nickname}>
            <div className={styles.inputHint}>Nickname</div>
            <Input
              placeholder="My house"
              value={this.state.values.company}
              error={this.state.errors.company}
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("company", val);
              }}
            />
          </div>

          <div className={styles.firstName}>
            <div className={styles.inputHint}>First Name</div>
            <Input
              placeholder="Jane"
              value={this.state.values.firstName}
              error={this.state.errors.firstName}
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("firstName", val);
              }}
            />
          </div>

          <div className={styles.lastName}>
            <div className={styles.inputHint}>Last Name</div>
            <Input
              placeholder="Doe"
              value={this.state.values.lastName}
              error={this.state.errors.lastName}
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("lastName", val);
              }}
            />
          </div>

          <div className={styles.address1}>
            <div className={styles.inputHint}>Address Line 1</div>
            {/*<Input*/}
            {/*  placeholder="123 Street Name"*/}
            {/*  value={this.state.values.address}*/}
            {/*  error={this.state.errors.address}*/}
            {/*  userInputStyle={true}*/}
            {/*  onChange={(val: string) => {*/}
            {/*    this.updateFieldForm("address", val);*/}
            {/*  }}*/}
            {/*/>*/}

            <AddressInput
              componentRef={(input) => {
                this.addressInputRef = input;
              }}
              // className={cn(styles.input, this.props.inputClassName)}
              initialValue={this.state.values.address}
              placeholder="123 Example Street"
              onAddressSelected={(addressInfo) => {
                this.updateValues(addressInfo);
              }}
            />
          </div>

          <div className={styles.address2}>
            <div className={styles.inputHint}>Address Line 2</div>
            <Input
              placeholder="Apt. #22A"
              value={this.state.values.aptNumber}
              error={this.state.errors.aptNumber}
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("aptNumber", val);
              }}
            />
          </div>

          <div className={styles.city}>
            <div className={styles.inputHint}>City</div>
            <Input
              placeholder="City"
              value={this.state.values.city}
              error={this.state.errors.city}
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("city", val);
              }}
            />
          </div>

          <div className={styles.state}>
            <div className={styles.inputHint}>State</div>
            <StyledSelect
              options={usaStates}
              values={usaStates.filter((state) => {
                return state?.abbreviation === this.state.values.region;
              })}
              labelField="abbreviation"
              valueField="abbreviation"
              dropdownPosition="auto"
              className={styles.dropDownStyle}
              onChange={(value) => {
                // @ts-ignore
                this.updateFieldForm("region", value[0]?.abbreviation);
              }}
            />
          </div>

          <div className={styles.zipcode}>
            <div className={styles.inputHint}>Zip Code</div>
            <Input
              placeholder="XXXXX-XXXX"
              value={this.state.values.zipCode}
              error={this.state.errors.zipCode}
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("zipcode", val);
              }}
            />
          </div>

          <div
            className={cn(
              "row center-vertically clickable",
              styles.defaultAddress
            )}
            onClick={() => {
              this.updateFieldForm("default", !this.state.values.default);
            }}
          >
            <Checkbox black={true} value={this.state.values.default} />
            <div className={styles.defaultAddressHint}>
              Make default shipping address
            </div>
          </div>
        </div>
        <div
          className={cn(
            "full-width center-vertically center-horizontally margin-top",
            styles.addAddressButtons
          )}
        >
          <button
            className={styles.cancelAddAddress}
            onClick={this.cancelClicked}
          >
            Cancel
          </button>
          <button
            className={styles.addAddressButton}
            onClick={this.saveClicked}
          >
            {this.props.editAddress && "Save"}
            {!this.props.editAddress && "Add Address"}
          </button>
        </div>
        {this.props.editAddress && (
          <button
            className={styles.deleteAddressButton}
            onClick={this.deleteClicked}
          >
            Delete this address
          </button>
        )}
      </div>
    );
  }

  updateFieldForm = (fieldName: string, value: any) => {
    this.setState({
      values: {
        ...this.state.values,
        [fieldName]: value,
      },
      errors: {
        ...this.state.errors,
        [fieldName]: null,
      },
    });
  };

  updateValues = (values: AddressFormValuesT) => {
    console.log(values);
    this.setState({
      values: {
        ...this.state.values,
        ...values,
      },
      errors: {
        ...NO_ERRORS,
      },
    });
    this.addressInputRef.updateValue(values.address);
  };

  saveClicked = () => {
    if (this.validateAddress()) {
      this.props.onSave(this.state.values, this.props?.editAddress?.id);
    }
  };

  deleteClicked = () => {
    this.props.onDelete(this.props?.editAddress?.id);
  };

  cancelClicked = () => {
    this.resetForm();
    if (this.props.editAddress) {
      this.props.onCancelEdit();
    }
  };

  validateAddress = () => {
    try {
      addAddressSchema.validateSync(this.state.values, {
        abortEarly: false,
      });
      return true;
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        errors: {
          ...this.state.errors,
          ...errors,
        },
      });
      return false;
    }
  };

  resetForm = () => {
    this.setState({
      values: DEFAULT_ADDRESS_VALUES,
    });
  };
}

//sorry broly :(

const StyledSelect = styled(Select)`
  --input-height: 40px;
  --input-border-radius: 24px;
  position: relative;
  font-family: "IBM Plex Sans", sans-serif;

  width: 100%;
  height: var(--input-height);
  padding: 10px 16px;
  border-radius: 5px;
  outline: none;
  border-color: rgba(var(--primary-color-rgb), 0.1);
  background-color: white;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  font-size: var(--font-size-md);
  transition: border-color 0.1s linear, box-shadow 0.1s linear;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  @include mobile-media {
    font-size: var(--font-size-sm);
  }

  &:hover {
    border-color: rgba(var(--primary-color-rgb), 0.4);
  }

  &:focus {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
    border-color: rgba(var(--primary-color-rgb), 0.6);
  }

  .react-dropdown-select-input {
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 14px;

    @include mobile-media {
      font-size: var(--font-size-sm);
    }
  }
`;
