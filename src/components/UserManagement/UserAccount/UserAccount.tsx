import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import styles from "./UserAccount.module.scss";
import imagePlaceholder from "assets/images/profile_placeholder.png";
import cn from "classnames";
import ResetPasswordForm from "components/common/Forms/ResetPasswordForm/ResetPasswordForm";
import UpdateProfileForm from "components/common/Forms/UpdateProfileForm/UpdateProfileForm";
import { isOnMobile } from "../../../utils/responsive";
import LogoMobile from "../../common/LogoMobile/LogoMobile";

type Props = RouteComponentProps;

type State = {
  showErrors: boolean;
  profileImageUrl: any;
};

export default class UserAccount extends React.Component<Props, State> {
  state = {
    showErrors: false,
    profileImageUrl: null,
  };

  updateProfileForm?: UpdateProfileForm;

  constructor(props) {
    super(props);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.removePhoto = this.removePhoto.bind(this);
  }

  renderResetPasswordSection = () => {
    return (
      <div
        className={cn(styles.section, styles.fitContent, styles.resetSection)}
      >
        <div className={styles.sectionHeader}>Reset Password</div>
        <ResetPasswordForm />
      </div>
    );
  };

  renderProfileInfo = () => {
    return (
      <div className={cn(styles.section, styles.updateProfileInfo)}>
        <div className={styles.sectionHeader}>Update profile Info</div>

        <div className="row center-vertically margin-top-big">
          <img
            src={
              this.state.profileImageUrl
                ? this.state.profileImageUrl
                : imagePlaceholder
            }
            className={styles.userImage}
            alt=""
          />
          <input
            className={styles.uploadInput}
            id={"cameraUpload"}
            type={"file"}
            accept={"image/*"}
            onChange={this.onFileSelected}
          />
          <div className={styles.editPhoto}>
            <button className={styles.editImageButton}>
              <label className={styles.uploadLabel} htmlFor={"cameraUpload"}>
                Upload new photo
              </label>
            </button>
            <button
              className={styles.editImageButton}
              onClick={this.removePhoto}
            >
              Remove photo
            </button>
          </div>
        </div>

        <div className="horizontal-divider margin-top" />
        <UpdateProfileForm
          componentRef={(ref) => {
            this.updateProfileForm = ref;
          }}
        />
        <div
          className={cn(
            "horizontal-divider margin-top-big",
            styles.horizontalDividerLinked
          )}
        />
        {this.renderLinkedAccountSection()}
        {this.renderDeleteAccount()}

        <div
          className={cn(
            "row center-vertically margin-top-big",
            styles.formEditButtons
          )}
        >
          <button className={styles.cancelButton}>Cancel</button>
          <button
            className={styles.saveChangesButton}
            onClick={() => {
              this.updateProfileForm.validateContactInfo();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  renderLinkedAccountSection = () => {
    return (
      <div className={cn("margin-top-big", styles.linkedAccounts)}>
        <div className={styles.subSectionHeader}>Linked Accounts</div>
        <div className={styles.description}>
          We use this to let you sign in and to populate your profile
          information. Only one account may be linked at a time.
        </div>
        <div className={styles.linkedAccountsGrid}>
          <div
            className={cn("row center-vertically", styles.linkedAccountOption)}
          >
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
          <div
            className={cn("row center-vertically", styles.linkedAccountOption)}
          >
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
        {isOnMobile() && <LogoMobile />}
        <UserHeader title={UserPages.Account.name} />
        <div className={styles.pageContent}>
          {this.renderProfileInfo()}
          {this.renderResetPasswordSection()}
        </div>
      </div>
    );
  }

  onFileSelected(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.setState({
        profileImageUrl: reader.result,
      });
    };
  }

  removePhoto() {
    this.setState({
      profileImageUrl: null,
    });
  }
}
