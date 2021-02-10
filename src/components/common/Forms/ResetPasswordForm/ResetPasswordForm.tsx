import React from "react";
import styles from "components/common/Forms/ResetPasswordForm/ResetPasswordForm.module.scss";
import Input from "components/common/Input/Input";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import { PASSWORD_REGEX } from "constants/general";

const resetPasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("Required"),
  newPassword: yup
    .string()
    .required("Required")
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 characters and contain an uppercase letter, a lowercase one and a special character"
    ),
  confirmNewPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("newPassword")], "Passwords don't match"),
});

type State = {
  resetPassword: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  resetPasswordErrors: {
    currentPassword: string | null;
    newPassword: string | null;
    confirmNewPassword: string | null;
  };
};

export default class ResetPasswordForm extends React.Component<any, State> {
  state = {
    resetPassword: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resetPasswordErrors: {
      currentPassword: null,
      newPassword: null,
      confirmNewPassword: null,
    },
  };

  render() {
    return (
      <div>
        <div className={styles.passwordInputLayout}>
          <div className={styles.inputHint}>Current Password</div>
          <Input
            placeholder="Current Password"
            type={"password"}
            value={this.state.resetPassword.currentPassword}
            onChange={(val: string) => {
              this.updatePasswordForm("currentPassword", val);
            }}
            error={this.state.resetPasswordErrors.currentPassword}
          />
        </div>
        <div className={styles.passwordInputLayout}>
          <div className={styles.inputHint}>New Password</div>
          <Input
            placeholder="New Password"
            type={"password"}
            value={this.state.resetPassword.newPassword}
            onChange={(val: string) => {
              this.updatePasswordForm("newPassword", val);
            }}
            error={this.state.resetPasswordErrors.newPassword}
          />
        </div>
        <div className={styles.passwordInputLayout}>
          <div className={styles.inputHint}>Confirm New Password</div>
          <Input
            placeholder="Confirm New Password"
            type={"password"}
            value={this.state.resetPassword.confirmNewPassword}
            onChange={(val: string) => {
              this.updatePasswordForm("confirmNewPassword", val);
            }}
            error={this.state.resetPasswordErrors.confirmNewPassword}
          />
        </div>
        <button
          className={styles.savePasswordButton}
          onClick={() => {
            this.validateContactInfo();
          }}
        >
          Save New Password
        </button>
      </div>
    );
  }

  updatePasswordForm = (fieldName: string, value: string) => {
    this.setState({
      resetPassword: {
        ...this.state.resetPassword,
        [fieldName]: value,
      },
      resetPasswordErrors: {
        ...this.state.resetPasswordErrors,
        [fieldName]: null,
      },
    });
  };

  validateContactInfo = () => {
    try {
      resetPasswordSchema.validateSync(this.state.resetPassword, {
        abortEarly: false,
      });
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        resetPasswordErrors: {
          ...this.state.resetPasswordErrors,
          ...errors,
        },
      });
    }
  };
}
