import * as React from "react";
import { AppContext, AppContextState } from "context/AppContext";
import { resetPassword } from "../../../context/CustomerAPI/api";
import Input from "../../common/Input/Input";
import styles from "./ResetPassword.module.scss";
import * as yup from "yup";
import { PASSWORD_REGEX } from "../../../constants/general";
import { extractErrors } from "../../../utils/forms";

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 characters and contain an uppercase letter, a lowercase one and a special character"
    )
    .required("Required"),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("password")], "Passwords don't match"),
});

export default class ResetPassword extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      resetPassword: {
        password: "",
        confirmPassword: "",
      },
      resetPasswordErrors: {
        password: null,
        confirmPassword: null,
      },
      token: null,
    };
  }

  validateResetPasswordSchema = (fieldName: string) => {
    try {
      resetPasswordSchema.validateSyncAt(fieldName, this.state.resetPassword, {
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

  updateField = (fieldName: string, value: string) => {
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

  resetPassword = async () => {
    let resetToken = new URLSearchParams(window.location.search).get("token");
    console.log(resetToken);
    const isValid = !Object.values(this.state.resetPasswordErrors).some(
      (field) => field !== null && field !== ""
    );
    if (isValid && resetToken) {
      const resp = await resetPassword(
        this.context,
        this.state.email,
        resetToken,
        this.state.resetPassword.confirmPassword
      );
      console.log("reset password response", resp);
    }
  };

  render() {
    return (
      <div className={styles.resetPasswordContainer}>
        <div className={styles.title}>Reset your password</div>
        <Input
          className={styles.inputField}
          placeholder="Email"
          type={"email"}
          userInputStyle={true}
          value={this.state.email}
          onChange={(val: string) => this.setState({ email: val })}
        />
        <Input
          className={styles.inputField}
          placeholder="New Password"
          type={"password"}
          userInputStyle={true}
          value={this.state.resetPassword.password}
          onChange={(val: string) => {
            this.updateField("password", val);
          }}
          onBlur={() => this.validateResetPasswordSchema("password")}
          error={this.state.resetPasswordErrors.password}
        />
        <Input
          className={styles.inputField}
          placeholder="Confirm Password"
          type={"password"}
          userInputStyle={true}
          value={this.state.resetPassword.confirmPassword}
          onChange={(val: string) => {
            this.updateField("confirmPassword", val);
          }}
          onBlur={() => this.validateResetPasswordSchema("confirmPassword")}
          error={this.state.resetPasswordErrors.confirmPassword}
        />
        <div className={styles.createButton} onClick={this.resetPassword}>
          Reset Password
        </div>
      </div>
    );
  }
}
