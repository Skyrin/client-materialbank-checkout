import Input from "components/common/Input/Input";
import { digitsOnlyInputParser } from "components/common/Input/utils";
import * as React from "react";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import styles from "./AddressForm.module.scss";
import cn from "classnames";
import AddressInput from "components/common/Input/AddressInput/AddressInput";
import SmartyStreetsSDK from "smartystreets-javascript-sdk";
import { debounce, get } from "lodash-es";
import { ZIPCODE_REGEX } from "constants/general";

export type AddressFormValuesT = {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  aptNumber: string;
  zipCode: string;
  phone: string;
  city?: string;
  region?: string;
};

export const DEFAULT_ADDRESS_FORM_VALUES: AddressFormValuesT = {
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  aptNumber: "",
  zipCode: "",
  phone: "",
  city: "",
  region: "",
};

const DEFAULT_FORM_SCHEMA = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  company: yup.string(),
  address: yup.string().required("Required"),
  aptNumber: yup.string(),
  zipCode: yup
    .string()
    .matches(ZIPCODE_REGEX, "Should be 5 digits")
    .required("Required"),
  phone: yup.string().required("Required"),
});

type AddressFormErrorsT = {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address: string | null;
  aptNumber: string | null;
  zipCode: string | null;
  phone: string | null;
};

type Props = {
  initialValues?: AddressFormValuesT;
  validationSchema?: any;
  onChange: (newValues: AddressFormValuesT) => void;
  componentRef?: (ref: AddressForm) => void;
  listClassName?: string;
  inputClassName?: string;
  visible?: boolean;
  withAutocomplete?: boolean;
};

type State = {
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
};

const ZipcodeLookup = SmartyStreetsSDK.usZipcode.Lookup;

export default class AddressForm extends React.Component<Props, State> {
  static defaultProps = {
    visible: true,
  };

  addressInputRef: AddressInput;

  zipcodeClient!: SmartyStreetsSDK.core.Client<
    SmartyStreetsSDK.usZipcode.Lookup,
    SmartyStreetsSDK.usZipcode.Lookup
  >;

  constructor(props: Props) {
    super(props);

    this.state = {
      values: props.initialValues || DEFAULT_ADDRESS_FORM_VALUES,
      errors: {
        firstName: null,
        lastName: null,
        company: null,
        address: null,
        aptNumber: null,
        zipCode: null,
        phone: null,
      },
    };

    if (props.componentRef) {
      // Can be used to call functions from outside the component.
      // i.e. triggering a full validation, or checking status of validations.
      props.componentRef(this);
    }
  }

  async componentDidMount() {
    const credentials = new SmartyStreetsSDK.core.SharedCredentials(
      process.env.REACT_APP_SMARTYSTREETS_CLIENT_KEY || "30500088655303291"
    );
    this.zipcodeClient = SmartyStreetsSDK.core.buildClient.usZipcode(
      credentials
    );
  }

  fetchZipcodeDetails = async () => {
    const input = this.state.values.zipCode;
    if (!input || !input.match(ZIPCODE_REGEX)) {
      return;
    }

    console.log("ZIPCODE FETCH");
    const lookup = new ZipcodeLookup();
    lookup.zipCode = input;
    const response = await this.zipcodeClient.send(lookup);
    console.log("ZIPCODE RESPONSE", response);
    const zipcodeResult = get(response, "lookups[0].result[0]");

    if (get(zipcodeResult, "valid")) {
      const zipcodeObj = get(zipcodeResult, "zipcodes[0]");
      if (
        zipcodeObj &&
        zipcodeObj.defaultCity &&
        zipcodeObj.stateAbbreviation
      ) {
        this.updateValues(
          {
            city: zipcodeObj.defaultCity,
            region: zipcodeObj.stateAbbreviation,
          },
          false
        );
      }
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          zipCode: "Invalid Zip Code",
        },
      });
    }
  };

  debouncedFetchZipcodeDetails = debounce(this.fetchZipcodeDetails, 400);

  updateField = (fieldName: string, value: string) => {
    this.setState(
      {
        values: {
          ...this.state.values,
          [fieldName]: value,
        },
        errors: {
          ...this.state.errors,
          [fieldName]: null,
        },
      },
      () => {
        this.props.onChange(this.state.values);
      }
    );
  };

  updateValues = (values: AddressFormValuesT, validate?: boolean) => {
    this.setState(
      {
        values: {
          ...this.state.values,
          ...values,
        },
      },
      () => {
        if (validate) {
          this.validateForm();
        }
        this.props.onChange(this.state.values);
      }
    );
    if (values.address && this.props.withAutocomplete && this.addressInputRef) {
      // Since the AddressInput is an uncontrolled component, we need to force-update
      // the displayed address in case we receive it from the outside (i.e. Paypal)
      this.addressInputRef.updateValue(values.address);
    }
  };

  processErrors = (e: any) => {
    const errors = extractErrors(e);
    this.setState({
      errors: {
        ...this.state.errors,
        ...errors,
      },
    });
  };

  validateForm = () => {
    try {
      const schema = this.getSchema();
      schema.validateSync(this.state.values, {
        abortEarly: false,
      });
    } catch (e) {
      this.processErrors(e);
    }
  };

  getSchema = () => {
    return this.props.validationSchema || DEFAULT_FORM_SCHEMA;
  };

  isValid = () => {
    const schema = this.getSchema();
    return schema.isValidSync(this.state.values) && !this.state.errors.zipCode;
  };

  validateField = (fieldName: string) => {
    try {
      const schema = this.getSchema();
      schema.validateSyncAt(fieldName, this.state.values, {
        abortEarly: false,
      });
    } catch (e) {
      this.processErrors(e);
    }
  };

  render() {
    return (
      <div
        className={cn(styles.addressForm, this.props.listClassName, {
          [styles.visible]: this.props.visible === true,
        })}
      >
        <div className={styles.inputLine}>
          <Input
            className={cn(styles.input, this.props.inputClassName)}
            placeholder="First Name*"
            value={this.state.values.firstName}
            onChange={(val: string) => {
              this.updateField("firstName", val);
            }}
            onBlur={() => {
              this.validateField("firstName");
            }}
            error={this.state.errors.firstName}
          />
          <Input
            className={cn(styles.input, this.props.inputClassName)}
            placeholder="Last Name*"
            value={this.state.values.lastName}
            onChange={(val: string) => {
              this.updateField("lastName", val);
            }}
            onBlur={() => {
              this.validateField("lastName");
            }}
            error={this.state.errors.lastName}
          />
        </div>
        <Input
          className={cn(styles.input, this.props.inputClassName)}
          placeholder="Company"
          value={this.state.values.company}
          onChange={(val: string) => {
            this.updateField("company", val);
          }}
          onBlur={() => {
            this.validateField("company");
          }}
          error={this.state.errors.company}
        />
        <div
          className={styles.inputLine}
          style={{
            gridTemplateColumns: "6.5fr 3.5fr",
          }}
        >
          {this.props.withAutocomplete ? (
            <AddressInput
              componentRef={(input) => {
                this.addressInputRef = input;
              }}
              className={cn(styles.input, this.props.inputClassName)}
              placeholder="Address*"
              onAddressSelected={(addressInfo) => {
                this.updateValues(addressInfo);
              }}
            />
          ) : (
            <Input
              className={cn(styles.input, this.props.inputClassName)}
              placeholder="Address*"
              value={this.state.values.address}
              onChange={(val: string) => {
                this.updateField("address", val);
              }}
              onBlur={() => {
                this.validateField("address");
              }}
              error={this.state.errors.address}
            />
          )}
          <Input
            className={cn(styles.input, this.props.inputClassName)}
            placeholder="Apt # / Suite"
            value={this.state.values.aptNumber}
            onChange={(val: string) => {
              this.updateField("aptNumber", val);
            }}
            onBlur={() => {
              this.validateField("aptNumber");
            }}
            error={this.state.errors.aptNumber}
          />
        </div>
        <div className={styles.inputLine}>
          <Input
            className={cn(styles.input, this.props.inputClassName)}
            placeholder="Zip Code*"
            value={this.state.values.zipCode}
            onChange={(val: string) => {
              this.updateField("zipCode", val);
              this.debouncedFetchZipcodeDetails();
            }}
            onBlur={() => {
              this.validateField("zipCode");
            }}
            error={this.state.errors.zipCode}
            parser={digitsOnlyInputParser}
            inputMode="numeric"
          />
          <span className={styles.zipCodeDescription}>
            {this.state.values.city
              ? `${this.state.values.city}, ${this.state.values.region}`
              : "Enter Zip Code for City & State"}
          </span>
        </div>
        <Input
          className={cn(styles.input, this.props.inputClassName)}
          placeholder="Phone Number*"
          type="tel"
          value={this.state.values.phone}
          onChange={(val: string) => {
            this.updateField("phone", val);
          }}
          onBlur={() => {
            this.validateField("phone");
          }}
          error={this.state.errors.phone}
        />
      </div>
    );
  }
}
