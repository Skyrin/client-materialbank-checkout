import React from "react";
import { InputErrorModel } from "utils/input-error.model";
import styles from "components/common/Forms/ResetPasswordForm/ResetPasswordForm.module.scss";
import Input from "components/common/Input/Input";
import { TreeUtils } from "utils/TreeUtils";

export class ResetPasswordModel {
  currentPassword: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
}

export class ResetPasswordErrors {
  currentPassword = new InputErrorModel(["required"]);
  newPassword = new InputErrorModel(
    ["required"],
    ResetPasswordErrors.newPasswordValidator
  );
  confirmNewPassword = new InputErrorModel(
    ["required"],
    ResetPasswordErrors.confirmPasswordValidator
  );

  private static newPasswordValidator(value): string {
    if (value) {
      if (value.length < 9) {
        return "Password needs to have at least 8 characters";
      }
    }
    return null;
  }

  private static confirmPasswordValidator(
    value,
    context: { data: any; topDownKeysList: [] }
  ): string {
    if (context.data?.newPassword !== value) {
      return "Passwords must match";
    }
    return null;
  }
}

export default class ResetPasswordForm extends React.Component<any, any> {
  state = {
    resetPassword: new ResetPasswordModel(),
    resetPasswordErrors: new ResetPasswordErrors(),
    optIn: true,
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
            error={this.state.resetPasswordErrors?.currentPassword?.errorText}
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
            error={this.state.resetPasswordErrors?.newPassword?.errorText}
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
            error={this.state.resetPasswordErrors.confirmNewPassword?.errorText}
          />
        </div>
        <button
          className={styles.savePasswordButton}
          onClick={() => {
            this.validateForm();
          }}
        >
          Save New Password
        </button>
      </div>
    );
  }

  updatePasswordForm = (fieldName: string, value: string) => {
    const newResetPassword = Object.assign({}, this.state.resetPassword);
    newResetPassword[fieldName] = value;

    const newResetPasswordErrors = Object.assign(
      {},
      this.state.resetPasswordErrors
    );
    newResetPasswordErrors[fieldName].errorText = "";

    this.setState({
      resetPassword: newResetPassword,
      resetPasswordErrors: newResetPasswordErrors,
    });
  };

  validateForm(): boolean {
    // Returns true if has errors
    const newResetPasswordErrors = Object.assign(
      {},
      this.state.resetPasswordErrors
    );

    this.setState({
      showErrors: true,
    });
    let hasErrors = false;

    // we traverse the data tree and get the leaves (and the stack of nested properties)
    TreeUtils.traverseTree(
      this.state.resetPassword,
      (leafValue, topDownKeysList) => {
        // we get the error objects from the found data leaves
        const error: InputErrorModel = TreeUtils.accessTreeByTopDownKeysList(
          newResetPasswordErrors,
          topDownKeysList
        );
        if (error && error instanceof InputErrorModel) {
          error.validate(leafValue, { data: this.state.resetPassword });
          console.log(error);
          if (error.errorText) {
            hasErrors = true;
          }
        }
      }
    );
    this.setState({
      resetPasswordErrors: newResetPasswordErrors,
    });
    return hasErrors;
  }
}
