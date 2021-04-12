import React from "react";
import styles from "components/common/Forms/UpdateProfileForm/UpdateProfileForm.module.scss";
import Input from "components/common/Input/Input";
import Checkbox from "components/common/Checkbox/Checkbox";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import { CustomerT } from "constants/types";
import { PASSWORD_REGEX } from "constants/general";

const updateProfileSchema = yup.object().shape({
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
    oldEmail: string;
    email: string;
    mobile: string;
  };
  updateProfileErrors: {
    email: string;
    mobile: string;
  };
  optIn: boolean;
  showErrors: boolean;
  isEmailChanged: boolean;
  isMobileChanged: boolean;
};

type Props = {
  componentRef?: (ref: UpdateProfileForm) => void;
};

export default class UpdateProfileForm extends React.Component<Props, State> {
  state = {
    updateProfile: {
      email: "",
      oldEmail: "",
      mobile: "",
    },
    updateProfileErrors: {
      email: "",
      mobile: "",
    },
    optIn: true,
    showErrors: true,
    isEmailChanged: false,
    isMobileChanged: false,
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
            <div className={styles.inputHint}>Email</div>
            <Input
              placeholder="Email"
              userInputStyle={true}
              value={this.state.updateProfile.email}
              onChange={(val: string) => {
                this.emailChanged(val);
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
              userInputStyle={true}
              onChange={(val: string) => {
                this.updateFieldForm("mobile", val);
                this.setState({
                  isMobileChanged: true,
                });
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
            className={styles.optInCheck}
            black={true}
            value={this.state.optIn}
            onChange={(val: boolean) => {
              this.setState({
                optIn: val,
              });
            }}
          />
          <div className={styles.optInHint}>
            Opt-in to newsletter: tips, ideas and promotional content sent to
            your email
          </div>
        </div>
      </div>
    );
  }

  emailChanged = (value: string) => {
    this.setState({
      isEmailChanged: this.state.updateProfile.oldEmail !== value,
    });
  };

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
      return true;
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        updateProfileErrors: {
          ...this.state.updateProfileErrors,
          ...errors,
        },
      });
      return false;
    }
  };

  newCustomerValues = (customerT: CustomerT) => {
    this.setState({
      updateProfile: {
        email: customerT?.email,
        oldEmail: customerT?.email,
        mobile: customerT?.mobile || "",
      },
      optIn: customerT.is_subscribed,
    });
  };
}
