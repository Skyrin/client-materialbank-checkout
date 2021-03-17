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
import { isOnMobile } from "utils/responsive";
import LogoMobile from "../../common/LogoMobile/LogoMobile";
import { AppContext, AppContextState } from "context/AppContext";
import Loader from "components/common/Loader/Loader";
import { UpdateCustomerInput } from "context/CustomerAPI/models";
import { ClientError } from "GraphqlClient";
import ErrorLabel from "components/common/ErrorLabel/ErrorLabel";
import LoginGoogle from "components/common/LoginGoogle/LoginGoogle";
import LoginFacebook from "components/common/LoginFacebook/LoginFacebook";
import { CustomerT } from "constants/types";

type Props = RouteComponentProps;

type State = {
  showErrors: boolean;
  profileImageUrl: any;
  resetPasswordNetworkError: string;
  updateProfileNetworkError: string;
  customer: CustomerT;
};

export default class UserAccount extends React.Component<Props, State> {
  state = {
    showErrors: false,
    profileImageUrl: null,
    resetPasswordNetworkError: "",
    updateProfileNetworkError: "",
    customer: null,
  };

  updateProfileForm?: UpdateProfileForm;
  static contextType = AppContext;
  context!: AppContextState;

  constructor(props) {
    super(props);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.removePhoto = this.removePhoto.bind(this);
  }

  componentDidMount() {
    this.context.requestCurrentCustomer().then((value) => {
      this.setState({
        customer: value,
      });
      this.updateProfileForm.newCustomerValues(value);
    });
  }

  renderResetPasswordSection = () => {
    return (
      <div
        className={cn(styles.section, styles.fitContent, styles.resetSection)}
      >
        <div className={styles.sectionHeader}>Reset Password</div>

        {this.state.resetPasswordNetworkError && (
          <ErrorLabel
            className={styles.errorLabel}
            errorText={this.state.resetPasswordNetworkError}
          />
        )}
        <ResetPasswordForm
          onSavePassword={(currentPassword: string, newPassword?: string) => {
            this.saveNewPasswordClick(currentPassword, newPassword);
          }}
        />
      </div>
    );
  };

  renderProfileInfo = () => {
    return (
      <div className={cn(styles.section, styles.updateProfileInfo)}>
        <div className={styles.sectionHeader}>Update profile Info</div>

        <div className={cn(styles.userImageRow)}>
          <div className={"row center-vertically"}>
            <img
              src={
                this.state.profileImageUrl
                  ? this.state.profileImageUrl
                  : imagePlaceholder
              }
              className={styles.userImage}
              alt=""
            />
            <div>
              <div className={styles.profileName}>
                {this.state.customer?.firstname} {this.state.customer?.lastname}
              </div>
              <div className={styles.profileEmail}>
                {this.state.customer?.email}
              </div>
            </div>
          </div>

          <div className={styles.editPhoto}>
            <input
              className={styles.uploadInput}
              id={"cameraUpload"}
              type={"file"}
              accept={"image/*"}
              onChange={this.onFileSelected}
            />
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
        {this.state.updateProfileNetworkError && (
          <ErrorLabel
            className={styles.errorLabel}
            errorText={this.state.updateProfileNetworkError}
          />
        )}

        <div className={cn("row center-vertically", styles.formEditButtons)}>
          <button className={styles.cancelButton}>Cancel</button>
          <button
            className={styles.saveChangesButton}
            onClick={() => {
              this.onSaveChangesClick();
            }}
          >
            Save Changes
          </button>
        </div>
        <div
          className={cn(
            "horizontal-divider margin-top-big",
            styles.horizontalDividerLinked
          )}
        />
        {this.renderLinkedAccountSection()}
        {this.renderDeleteAccount()}
      </div>
    );
  };

  renderLinkedAccountSection = () => {
    return (
      <div className={cn(styles.linkedAccounts)}>
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
          {/*<button className={styles.connectAccountButton} onClick={() => {}}>*/}
          {/*  Connect*/}
          {/*</button>*/}

          <LoginGoogle
            className={styles.connectAccountButton}
            buttonProp={
              <button
                className={styles.connectAccountButton}
                onClick={() => {}}
              >
                Connect
              </button>
            }
          />

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

          <LoginFacebook
            buttonText={"Connect"}
            className={styles.connectAccountButton}
            hasIcon={false}
          />
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
          <button className={styles.deleteAccountButton} onClick={() => {}}>
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
        <UserHeader
          title={UserPages.Account.name}
          customer={this.state.customer}
        />
        <div className={styles.pageContent}>
          {this.renderProfileInfo()}
          {this.renderResetPasswordSection()}
        </div>

        {this.context.customerLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
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

  saveNewPasswordClick = (currentPassword: string, newPassword?: string) => {
    this.setState({
      resetPasswordNetworkError: "",
    });
    this.context
      .changePassword(currentPassword, newPassword)
      .then(() => {})
      .catch((error: ClientError) => {
        let errorMessage = error.graphqlErrors[0]?.message
          ? error.graphqlErrors[0].message
          : error.message;

        this.setState({
          resetPasswordNetworkError: errorMessage,
        });
      });
  };

  onSaveChangesClick = () => {
    this.setState({
      updateProfileNetworkError: "",
    });
    if (this.updateProfileForm.validateContactInfo()) {
      const customerInput = new UpdateCustomerInput({
        is_subscribed: this.updateProfileForm.state.optIn,
      });

      if (this.updateProfileForm.state.isEmailChanged) {
        customerInput.email = this.updateProfileForm.state.updateProfile.email;
        customerInput.password = this.updateProfileForm.state.updateProfile.password;
      }

      this.context
        .updateCustomerV2(customerInput)
        .then(() => {})
        .catch((error: ClientError) => {
          let errorMessage = error.graphqlErrors[0]?.message
            ? error.graphqlErrors[0].message
            : error.message;

          this.setState({
            updateProfileNetworkError: errorMessage,
          });
        });
    }
  };
}
