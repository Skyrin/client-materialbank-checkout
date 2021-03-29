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
import { AppContext, AppContextState } from "context/AppContext";
import Loader from "components/common/Loader/Loader";
import { UpdateCustomerInput } from "context/CustomerAPI/models";
import { ClientError } from "GraphqlClient";
import ErrorLabel from "components/common/ErrorLabel/ErrorLabel";
import LoginGoogle from "components/common/LoginGoogle/LoginGoogle";
import LoginFacebook from "components/common/LoginFacebook/LoginFacebook";
import { CustomerT } from "constants/types";
import { RESTRequest } from "RestClient";

type Props = RouteComponentProps;

type State = {
  showErrors: boolean;
  file: any;
  fileUrl: string;
  fileName: string;
  resetPasswordNetworkError: string;
  updateProfileNetworkError: string;
  customer: CustomerT;
};

export default class UserAccount extends React.Component<Props, State> {
  state = {
    showErrors: false,
    file: null,
    fileUrl: "",
    fileName: "",
    resetPasswordNetworkError: "",
    updateProfileNetworkError: "",
    customer: null,
  };

  updateProfileForm?: UpdateProfileForm;
  static contextType = AppContext;
  context!: AppContextState;

  constructor(props) {
    super(props);
    this.handleImageUpload = this.handleImageUpload.bind(this);
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
              src={this.state.fileUrl ? this.state.fileUrl : imagePlaceholder}
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
              onChange={this.handleImageUpload}
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
        {isOnMobile() && this.renderResetPasswordSection()}
        {isOnMobile() && <div className="horizontal-divider margin-top-big" />}
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
        <UserHeader
          title={UserPages.Account.name}
          customer={this.state.customer}
        />
        <div className={styles.pageContent}>
          {this.renderProfileInfo()}
          {!isOnMobile() && this.renderResetPasswordSection()}
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

  toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  handleImageUpload = async (e: any) => {
    // const base64 = await this.toBase64(e.target.files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log("FILE1", reader.result);

      this.setState({
        file: reader.result,
        fileUrl: URL.createObjectURL(e.target.files[0]),
        fileName: e.target.files[0].name,
      });

      this.uploadPhoto();
    };
    //
    // console.log("FILE", e.target.files[0]);
    // console.log("base64", base64);
    //
    // this.setState({
    //   file: base64,
    //   fileUrl: URL.createObjectURL(e.target.files[0]),
    //   fileName: e.target.files[0].name,
    // });

    // await this.uploadPhoto();
  };

  uploadPhoto = async () => {
    const base64result = this.state.file.split(",")[1];
    const customer = {
      customer: {
        attribute_code: "profile_image",
        value: {
          name: "test.jpg",
          base64EncodedData:
            "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",
        },
      },
    };

    console.log(customer);

    const response = await RESTRequest(
      "POST",
      "customers/profile-image",
      customer,
      false
    );
    const respBody = await response.json();
    console.log("UPLOADED");
    console.log(respBody);
    if (response.ok && respBody) {
      return respBody;
    }
    return null;
  };

  removePhoto() {
    this.setState({
      file: null,
      fileUrl: "",
      fileName: "",
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
