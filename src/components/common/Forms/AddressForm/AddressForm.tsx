import Input from "components/common/Input/Input";
import { digitsOnlyInputParser } from "components/common/Input/utils";
import * as React from "react";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import styles from "./AddressForm.module.scss";
import cn from "classnames";

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
    .matches(/[0-9]+/, "Digits Only")
    .required(),
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
};

type State = {
  values: AddressFormValuesT;
  errors: AddressFormErrorsT;
};

// TODO: Find a way to update the AddressForm from the parent asynchronously  (not in the constructor)
//       Why: When we get data from the backend after the form has initialised

export default class AddressForm extends React.Component<Props, State> {
  static defaultProps = {
    visible: true,
  };

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
          className={cn(styles.input, this.props.inputClassName)}
          placeholder="Phone Number*"
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
