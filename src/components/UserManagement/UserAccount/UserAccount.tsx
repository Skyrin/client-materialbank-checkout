import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import styles from "./UserAccount.module.scss";
import Input from "components/common/Input/Input";
import { InputErrorModel } from "utils/input-error.model";
import { TreeUtils } from "utils/TreeUtils";
import imagePlaceholder from "assets/images/profile_placeholder.png";
import Checkbox from "components/common/Checkbox/Checkbox";
import cn from "classnames";

type Props = RouteComponentProps;

export class ResetPasswordModel {
  currentPassword: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
}

export class ResetPasswordErrors {
  currentPassword = new InputErrorModel(["required"]);
  newPassword = new InputErrorModel(["required"], this.newPasswordValidator);
  confirmNewPassword = new InputErrorModel(
    ["required"],
    this.confirmPasswordValidator
  );

  private newPasswordValidator(
    value,
    context: { data: any; topDownKeysList: [] }
  ): string {
    if (value) {
      if (value.length < 9) {
        return "Password needs to have at least 8 characters";
      }
    }
    return null;
  }

  private confirmPasswordValidator(
    value,
    context: { data: any; topDownKeysList: [] }
  ): string {
    if (context.data?.newPassword !== context.data?.confirmNewPassword) {
      return "Passwords must match";
    }
    return null;
  }
}

export class UpdateProfileModel {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  mobile: string = "";
}

export class UpdateProfileErrors {
  firstName = new InputErrorModel(["required"]);
  lastName = new InputErrorModel(["required"]);
  email = new InputErrorModel(["required"]);
  mobile = new InputErrorModel(["required"]);
}
//
// type State = {
//   resetPassword: ResetPasswordModel;
//   resetPasswordErrors: ResetPasswordErrors;
//   updateProfile: UpdateProfileModel;
//   updateProfileErrors: UpdateProfileErrors;
//   optIn: boolean;
//   showErrors: boolean;
// };

export default class UserAccount extends React.Component<Props, any> {
  state = {
    resetPassword: new ResetPasswordModel(),
    resetPasswordErrors: new ResetPasswordErrors(),
    updateProfile: new UpdateProfileModel(),
    updateProfileErrors: new UpdateProfileErrors(),
    optIn: true,
    showErrors: false,
  };

  renderResetPasswordSection = () => {
    return (
      <div className={cn(styles.section, styles.fitContent)}>
        <div className={styles.sectionHeader}>Reset Password</div>

        <div className={styles.passwordInputLayout}>
          <div className={styles.inputHint}>Current Password</div>
          <Input
            placeholder="Current Password"
            type={"password"}
            value={this.state.resetPassword.currentPassword}
            onChange={(val: string) => {
              this.updateFieldForm(
                "currentPassword",
                val,
                "resetPassword",
                "resetPasswordErrors"
              );
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
              this.updateFieldForm(
                "newPassword",
                val,
                "resetPassword",
                "resetPasswordErrors"
              );
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
              this.updateFieldForm(
                "confirmNewPassword",
                val,
                this.state.resetPassword,
                "resetPasswordErrors"
              );
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
  };

  renderProfileInfo = () => {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Update profile Info</div>

        <div className="row center-vertically margin-top-big">
          <img src={imagePlaceholder} className={styles.userImage} />
          <div className={styles.editImageButton}>Upload new photo</div>
          <div className={styles.editImageButton}>Remove photo</div>
        </div>

        <div className="horizontal-divider margin-top" />

        <div className={styles.updateProfileForm}>
          <div className={styles.profileInputLayout}>
            <div className={styles.inputHint}>First</div>
            <Input
              placeholder="First name"
              value={this.state.updateProfile.firstName}
              onChange={(val: string) => {
                this.updateFieldForm(
                  "firstName",
                  val,
                  "updateProfile",
                  "updateProfileErrors"
                );
              }}
              error={this.state.updateProfileErrors.firstName?.errorText}
            />
          </div>

          <div className={styles.profileInputLayout}>
            <div className={styles.inputHint}>Last</div>
            <Input
              placeholder="Last name"
              value={this.state.updateProfile.lastName}
              onChange={(val: string) => {
                this.updateFieldForm(
                  "lastName",
                  val,
                  "updateProfile",
                  "updateProfileErrors"
                );
              }}
              error={this.state.updateProfileErrors.lastName?.errorText}
            />
          </div>

          <div className={styles.profileInputLayout}>
            <div className={styles.inputHint}>Email</div>
            <Input
              placeholder="Email"
              value={this.state.updateProfile.email}
              onChange={(val: string) => {
                this.updateFieldForm(
                  "email",
                  val,
                  "updateProfile",
                  "updateProfileErrors"
                );
              }}
              error={this.state.updateProfileErrors.email?.errorText}
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
                this.updateFieldForm(
                  "mobile",
                  val,
                  "updateProfile",
                  "updateProfileErrors"
                );
              }}
              error={this.state.updateProfileErrors.mobile?.errorText}
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
        <div className="horizontal-divider margin-top-big" />
        {this.renderLinkedAccountSection()}
        {this.renderDeleteAccount()}

        <div className="row center-vertically margin-top-big">
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveChangesButton}>Save Changes</button>
        </div>
      </div>
    );
  };

  renderLinkedAccountSection = () => {
    return (
      <div className="margin-top-big">
        <div className={styles.subSectionHeader}>Linked Accounts</div>
        <div className={styles.description}>
          We use this to let you sign in and to populate your profile
          information. Only one account ay be linked at a time.
        </div>
        <div className={styles.linkedAccountsGrid}>
          <div className="row center-vertically">
            <i
              className={cn(
                "fab",
                "fa-google fa-2x",
                styles.connectAccountIcon
              )}
            />
            <div className={styles.connectAccountText}>Sign in with Google</div>
          </div>
          <button className={styles.connectAccountButton} onClick={() => {}}>
            Connect
          </button>
          <div className="row center-vertically">
            <i
              className={cn(
                "fab",
                "fa-facebook fa-2x",
                styles.connectAccountIcon
              )}
            />
            <div className={styles.connectAccountText}>
              Sign in with Facebook
            </div>
          </div>
          <button className={styles.connectAccountButton} onClick={() => {}}>
            Connect
          </button>
        </div>
        <div className="horizontal-divider margin-top-big" />
      </div>
    );
  };

  renderDeleteAccount = () => {
    return (
      <div className="margin-top-big">
        <div className={styles.subSectionHeader}>Delete Account</div>
        <div className={styles.deleteAccountGrid}>
          <div className={styles.description}>
            We're sorry to see you go! By deleting your account, you will lose
            all of your favorites and account history.
          </div>
          <button className={styles.connectAccountButton} onClick={() => {}}>
            Delete...
          </button>
        </div>
        <div className="horizontal-divider margin-top-big" />
      </div>
    );
  };

  render() {
    return (
      <div className={styles.UserAccount}>
        <UserHeader title={UserPages.Account.name} />
        <div className={styles.pageContent}>
          {this.renderProfileInfo()}
          {this.renderResetPasswordSection()}
        </div>
      </div>
    );
  }

  updateFieldForm = (
    fieldName: string,
    value: string,
    form,
    formError: string
  ) => {
    const newResetPassword = Object.assign({}, this.state[form]);
    newResetPassword[fieldName] = value;

    const newResetPasswordErrors = Object.assign({}, this.state[formError]);
    newResetPasswordErrors[fieldName].errorText = "";

    this.setState({
      [form]: newResetPassword,
      [formError]: newResetPasswordErrors,
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
