import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import styles from "./UserAccount.module.scss";
import Input from "components/common/Input/Input";
import { InputErrorModel } from "utils/input-error.model";
import { TreeUtils } from "utils/TreeUtils";

type Props = RouteComponentProps;

export class ResetPasswordModel {
  currentPassword: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
}

type State = {
  resetPassword: ResetPasswordModel;
  resetPasswordErrors: {
    currentPassword: InputErrorModel;
    newPassword: InputErrorModel;
    confirmNewPassword: InputErrorModel;
  };
  showErrors: boolean;
};

export default class UserAccount extends React.Component<Props, State> {
  state = {
    resetPassword: new ResetPasswordModel(),
    resetPasswordErrors: {
      currentPassword: new InputErrorModel(["required"]),
      newPassword: new InputErrorModel(["required"]),
      confirmNewPassword: new InputErrorModel(["required"]),
    },
    showErrors: false,
  };

  render() {
    console.log(this.state);
    return (
      <div className={styles.UserAccount}>
        <UserHeader title={UserPages.Account.name} />
        <div className={styles.pageContent}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>Update profile Info</div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>Reset Password</div>

            <div className={styles.passwordInputLayout}>
              <div className={styles.inputHint}>Current Password</div>
              <Input
                placeholder="Current Password"
                value={this.state.resetPassword.currentPassword}
                onChange={(val: string) => {
                  this.updateField("currentPassword", val);
                }}
                error={
                  this.state.resetPasswordErrors?.currentPassword?.errorText
                }
              />
            </div>
            <div className={styles.passwordInputLayout}>
              <div className={styles.inputHint}>New Password</div>
              <Input
                placeholder="New Password"
                value={this.state.resetPassword.newPassword}
                onChange={(val: string) => {
                  this.updateField("newPassword", val);
                }}
                error={this.state.resetPasswordErrors?.newPassword?.errorText}
              />
            </div>
            <div className={styles.passwordInputLayout}>
              <div className={styles.inputHint}>Confirm New Password</div>
              <Input
                placeholder="Confirm New Password"
                value={this.state.resetPassword.confirmNewPassword}
                onChange={(val: string) => {
                  this.updateField("confirmNewPassword", val);
                }}
                error={
                  this.state.resetPasswordErrors.confirmNewPassword?.errorText
                }
              />
            </div>
            <button
              className={styles.whiteButton}
              onClick={() => {
                this.validateForm();
              }}
            >
              Save New Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  updateField = (fieldName: string, value: string) => {
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
          error.validate(leafValue);
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
