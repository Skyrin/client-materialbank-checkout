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
import { AppContext, AppContextState, Modals } from "context/AppContext";
import Loader from "components/common/Loader/Loader";
import { ClientError } from "GraphqlClient";
import ErrorLabel from "components/common/ErrorLabel/ErrorLabel";
import LoginGoogle from "components/common/LoginGoogle/LoginGoogle";
import LoginFacebook from "components/common/LoginFacebook/LoginFacebook";
import { CustomerT } from "constants/types";
import { RESTRequest } from "RestClient";
import { get } from "lodash";

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

  async componentDidMount() {
    const customerResp = await RESTRequest("GET", "customers/me");
    const customer = await customerResp.json();
    console.log("REST CUSTOMER", customer);
    const mobilePhoneAttribute = (customer.custom_attributes || []).find(
      (attr) => attr.attribute_code === "mobile_phone"
    );
    const mobilePhone =
      mobilePhoneAttribute && mobilePhoneAttribute.value
        ? mobilePhoneAttribute.value
        : "";
    const fullCustomer = {
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      mobile: mobilePhone,
      is_subscribed: customer.extension_attributes.is_subscribed,
    };
    this.setState({
      customer: fullCustomer,
    });
    this.updateProfileForm.newCustomerValues(fullCustomer);
    this.fetchCustomerImage();
  }

  disableAccount = () => {
    this.context.openModal(Modals.DisableAccount);
  };

  fetchCustomerImage = async () => {
    const customerResp = await RESTRequest("GET", "customers/me");
    const customer = await customerResp.json();
    const profileImageUrl = get(customer, "extension_attributes.profile_image");
    if (profileImageUrl) {
      this.setState({
        fileUrl: profileImageUrl,
      });
    }
  };

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
          <button
            className={styles.deleteAccountButton}
            onClick={this.disableAccount}
          >
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
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      this.setState(
        {
          file: reader.result,
          fileUrl: URL.createObjectURL(e.target.files[0]),
          fileName: e.target.files[0].name,
        },
        () => {
          this.uploadPhoto();
        }
      );
    };
  };

  uploadPhoto = async () => {
    const base64result = this.state.file.split(",")[1];
    const imageMetadata = this.state.file.split(",")[0];
    const imageTypeMatch = imageMetadata.match(/data:([a-zA-Z/]+);/);
    const imageType = imageTypeMatch[1];
    const customer = {
      customer: {
        attribute_code: "profile_image",
        value: {
          name: this.state.fileName,
          type: imageType,
          base64EncodedData: base64result,
        },
      },
    };

    console.log("IMAGE UPLOAD BODY", customer);

    const response = await RESTRequest(
      "POST",
      "customers/profile-image",
      customer
    );
    const respBody = await response.json();
    console.log("UPLOADED");
    console.log(respBody);
    if (response.ok && respBody) {
      return respBody;
    }
    return null;
  };

  removePhoto = async () => {
    const response = await RESTRequest("DELETE", "customers/profile-image");
    const respBody = await response.json();
    console.log("REMOVED");
    console.log(respBody);
    this.setState({
      file: null,
      fileUrl: "",
      fileName: "",
    });
  };

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

  onSaveChangesClick = async () => {
    this.setState({
      updateProfileNetworkError: "",
    });
    if (this.updateProfileForm.validateContactInfo()) {
      const customerResp = await RESTRequest("GET", "customers/me");
      const customer = await customerResp.json();
      customer.email = this.updateProfileForm.state.updateProfile.email;
      customer.custom_attributes = [
        {
          attribute_code: "mobile_phone",
          value: this.updateProfileForm.state.updateProfile.mobile,
        },
      ];
      customer.extension_attributes = {
        is_subscribed: this.updateProfileForm.state.optIn,
      };
      const updateResponse = await RESTRequest("PUT", "customers/me", {
        customer: customer,
      });
      await updateResponse.json();
    }
  };
}
