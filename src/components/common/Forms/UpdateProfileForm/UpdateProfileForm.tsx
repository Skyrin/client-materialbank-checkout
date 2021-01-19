import React from "react";
import styles from "components/common/Forms/UpdateProfileForm/UpdateProfileForm.module.scss";
import Input from "components/common/Input/Input";
import Checkbox from "components/common/Checkbox/Checkbox";
import * as yup from "yup";
import { extractErrors } from "utils/forms";

const updateProfileSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Email is invalid").required("Required"),
  mobile: yup
    .string()
    .transform((value) => (!value ? null : value))
    .nullable()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Invalid Phone"
    ),
});

type State = {
  updateProfile: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  };
  updateProfileErrors: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  };
  optIn: boolean;
  showErrors: boolean;
};

type Props = {
  componentRef?: (ref: UpdateProfileForm) => void;
};

export default class UpdateProfileForm extends React.Component<Props, State> {
  state = {
    updateProfile: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    },
    updateProfileErrors: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    },
    optIn: true,
    showErrors: true,
  };

  constructor(props: Props) {
    super(props);

    if (props.componentRef) {
      props.componentRef(this);
    }
  }

  render() {
    return (
      <div>
        <div className={styles.updateProfileForm}>
          <div className={styles.profileInputLayout}>
            <div className={styles.inputHint}>First</div>
            <Input
              placeholder="First name"
              value={this.state.updateProfile.firstName}
              onChange={(val: string) => {
                this.updateFieldForm("firstName", val);
              }}
              error={this.state.updateProfileErrors.firstName}
            />
          </div>

          <div className={styles.profileInputLayout}>
            <div className={styles.inputHint}>Last</div>
            <Input
              placeholder="Last name"
              value={this.state.updateProfile.lastName}
              onChange={(val: string) => {
                this.updateFieldForm("lastName", val);
              }}
              error={this.state.updateProfileErrors.lastName}
            />
          </div>

          <div className={styles.profileInputLayout}>
            <div className={styles.inputHint}>Email</div>
            <Input
              placeholder="Email"
              value={this.state.updateProfile.email}
              onChange={(val: string) => {
                this.updateFieldForm("email", val);
              }}
              error={this.state.updateProfileErrors.email}
            />
          </div>

          <div className={styles.profileInputLayout}>
            <div className="row center-vertically">
              <div className={styles.inputHint}>Mobile</div>
              <div className={styles.mobileHint}>
                *Optional - get order notifications via text
              </div>
            </div>
            <Input
              placeholder="Mobile"
              value={this.state.updateProfile.mobile}
              onChange={(val: string) => {
                this.updateFieldForm("mobile", val);
              }}
              error={this.state.updateProfileErrors.mobile}
            />
          </div>
        </div>
        <div
          className="row center-vertically margin-top clickable"
          onClick={() => {
            this.setState({
              optIn: !this.state.optIn,
            });
          }}
        >
          <Checkbox
            black={true}
            value={this.state.optIn}
            onChange={(val: boolean) => {
              this.setState({
                optIn: val,
              });
            }}
          />
          <div className={styles.optInHint}>
            Opt-in to Design Shop's newsletter: tips, ideas and promotional
            content sent to your email
          </div>
        </div>
      </div>
    );
  }

  updateFieldForm = (fieldName: string, value: string) => {
    this.setState({
      updateProfile: {
        ...this.state.updateProfile,
        [fieldName]: value,
      },
      updateProfileErrors: {
        ...this.state.updateProfileErrors,
        [fieldName]: null,
      },
    });
  };

  validateContactInfo = () => {
    try {
      updateProfileSchema.validateSync(this.state.updateProfile, {
        abortEarly: false,
      });
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        updateProfileErrors: {
          ...this.state.updateProfileErrors,
          ...errors,
        },
      });
    }
  };
}
