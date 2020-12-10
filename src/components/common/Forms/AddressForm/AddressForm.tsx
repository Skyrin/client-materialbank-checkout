import Input from "components/common/Input/Input";
import { digitsOnlyInputParser } from "components/common/Input/utils";
import * as React from "react";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import styles from "./AddressForm.module.scss";

export type AddressFormValuesT = {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  aptNumber: string;
  zipCode: string;
  phone: string;
};

export const DEFAULT_ADDRESS_FORM_VALUES: AddressFormValuesT = {
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  aptNumber: "",
  zipCode: "",
  phone: "",
};

const DEFAULT_FORM_SCHEMA = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  company: yup.string(),
  address: yup.string().required(),
  aptNumber: yup.string(),
  zipCode: yup
    .string()
    .matches(/[0-9]+/, "Digits Only")
    .required(),
  phone: yup.string(),
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
};

type State = {
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
};

export default class AddressForm extends React.Component<Props, State> {
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
    return schema.isValidSync(this.state.values);
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
      <div className={styles.addressForm}>
        <div className={styles.inputLine}>
          <Input
            className={styles.input}
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
            className={styles.input}
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
          className={styles.input}
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
            gridTemplateColumns:
              "calc(65% - var(--horizontal-spacing-normal) / 2) calc(35% - var(--horizontal-spacing-normal) / 2)",
          }}
        >
          <Input
            className={styles.input}
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
          <Input
            className={styles.input}
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
            className={styles.input}
            placeholder="Zip Code*"
            value={this.state.values.zipCode}
            onChange={(val: string) => {
              this.updateField("zipCode", val);
            }}
            onBlur={() => {
              this.validateField("zipCode");
            }}
            error={this.state.errors.zipCode}
            parser={digitsOnlyInputParser}
            inputMode="numeric"
          />
          <span className={styles.zipCodeDescription}>
            Enter Zip Code for City & State
          </span>
        </div>
        <Input
          className={styles.input}
          placeholder="Phone Number (optional)"
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