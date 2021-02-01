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
import { useState } from "react";

const addAddressSchema = yup.object().shape({
  nickname: yup.string().required("Required"),
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  addressLine1: yup.string().required("Required"),
  addressLine2: yup.string().required("Required"),
  city: yup.string().required("Required"),
  state: yup.string().required("Required"),
  zipcode: yup.string().required("Required"),
});

export const DEFAULT_ADDRESS_VALUES: AddressFormValuesT = {
  nickname: "",
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: usaStates[0].abbreviation,
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

type Props = {
  initialValues?: AddressFormValuesT;
  onSave?: (addressValues: AddressFormValuesT) => void;
};

type State = {
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
};

export default class MapAddressForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      values: props.initialValues || DEFAULT_ADDRESS_VALUES,
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
      <div>
        <div className={styles.title}>Add a New Address</div>
        <div className={styles.addressForm}>
          <div className={styles.nickname}>
            <div className={styles.inputHint}>Nickname</div>
            <Input
              placeholder="My house"
              value={this.state.values.nickname}
              error={this.state.errors.nickname}
              onChange={(val: string) => {
                this.updateFieldForm("nickname", val);
              }}
            />
          </div>

          <div className={styles.firstName}>
            <div className={styles.inputHint}>First Name</div>
            <Input
              placeholder="Jane"
              value={this.state.values.firstName}
              error={this.state.errors.firstName}
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
              onChange={(val: string) => {
                this.updateFieldForm("lastName", val);
              }}
            />
          </div>

          <div className={styles.address1}>
            <div className={styles.inputHint}>Address Line 1</div>
            <Input
              placeholder="123 Street Name"
              value={this.state.values.addressLine1}
              error={this.state.errors.addressLine1}
              onChange={(val: string) => {
                this.updateFieldForm("addressLine1", val);
              }}
            />
          </div>

          <div className={styles.address2}>
            <div className={styles.inputHint}>Address Line 2</div>
            <Input
              placeholder="Apt. #22A"
              value={this.state.values.addressLine2}
              error={this.state.errors.addressLine2}
              onChange={(val: string) => {
                this.updateFieldForm("addressLine2", val);
              }}
            />
          </div>

          <div className={styles.city}>
            <div className={styles.inputHint}>City</div>
            <Input
              placeholder="City"
              value={this.state.values.city}
              error={this.state.errors.city}
              onChange={(val: string) => {
                this.updateFieldForm("city", val);
              }}
            />
          </div>

          <div className={styles.state}>
            <div className={styles.inputHint}>State</div>
            <StyledSelect
              options={usaStates}
              values={[usaStates[0]]}
              labelField="abbreviation"
              valueField="abbreviation"
              dropdownPosition="auto"
              className={styles.dropDownStyle}
              onChange={(value) => this.updateFieldForm("state", value)}
            />
          </div>

          <div className={styles.zipcode}>
            <div className={styles.inputHint}>Zip Code</div>
            <Input
              placeholder="XXXXX-XXXX"
              value={this.state.values.zipcode}
              error={this.state.errors.zipcode}
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
        <div className="row full-width center-vertically center-horizontally margin-top">
          <button className={styles.cancelAddAddress}>Cancel</button>
          <button
            className={styles.addAddressButton}
            onClick={this.saveClicked}
          >
            Add Address
          </button>
        </div>
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

  saveClicked = () => {
    if (this.validateAddress()) {
      this.props.onSave(this.state.values);
    } else {
      console.log(this.state.errors);
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
  border-radius: var(--input-border-radius);
  outline: none;
  border: 1px solid rgba(var(--primary-color-rgb), 0.1);
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
  }
`;
