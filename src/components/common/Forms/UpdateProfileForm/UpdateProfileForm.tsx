import React from "react";
import styles from "components/common/Forms/UpdateProfileForm/UpdateProfileForm.module.scss";
import Input from "components/common/Input/Input";
import { InputErrorModel } from "utils/input-error.model";
import Checkbox from "components/common/Checkbox/Checkbox";
import { TreeUtils } from "utils/TreeUtils";

export class UpdateProfileModel {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  mobile: string = "";
}

export class UpdateProfileErrors {
  firstName = new InputErrorModel(["required"]);
  lastName = new InputErrorModel(["required"]);
  email = new InputErrorModel(["required"], UpdateProfileErrors.emailValidator);
  mobile = new InputErrorModel([], UpdateProfileErrors.mobileValidator);

  private static emailValidator(value): string {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Email address is invalid";
    }
    return null;
  }

  private static mobileValidator(value): string {
    if (value && !/^(\+|\d)[0-9]{7,16}$/.test(value)) {
      return "Phone number is invalid";
    }
    return null;
  }
}

type State = {
  updateProfile: UpdateProfileModel;
  updateProfileErrors: UpdateProfileErrors;
  optIn: boolean;
  showErrors: boolean;
};

type Props = {
  componentRef?: (ref: UpdateProfileForm) => void;
};

export default class UpdateProfileForm extends React.Component<Props, State> {
  state = {
    updateProfile: new UpdateProfileModel(),
    updateProfileErrors: new UpdateProfileErrors(),
    optIn: true,
    showErrors: true,
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
            <div className={styles.inputHint}>First</div>
            <Input
              placeholder="First name"
              value={this.state.updateProfile.firstName}
              onChange={(val: string) => {
                this.updateFieldForm("firstName", val);
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
                this.updateFieldForm("lastName", val);
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
                this.updateFieldForm("email", val);
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
                this.updateFieldForm("mobile", val);
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
      </div>
    );
  }

  updateFieldForm = (fieldName: string, value: string) => {
    const updateProfile = Object.assign({}, this.state.updateProfile);
    updateProfile[fieldName] = value;

    const updateProfileErrors = Object.assign(
      {},
      this.state.updateProfileErrors
    );
    updateProfileErrors[fieldName].errorText = "";

    this.setState({
      updateProfile: updateProfile,
      updateProfileErrors: updateProfileErrors,
    });
  };

  validateForm(): boolean {
    // Returns true if has errors
    const newUpdateProfileErrors = Object.assign(
      {},
      this.state.updateProfileErrors
    );

    this.setState({
      showErrors: true,
    });
    let hasErrors = false;

    // we traverse the data tree and get the leaves (and the stack of nested properties)
    TreeUtils.traverseTree(
      this.state.updateProfile,
      (leafValue, topDownKeysList) => {
        // we get the error objects from the found data leaves
        const error: InputErrorModel = TreeUtils.accessTreeByTopDownKeysList(
          newUpdateProfileErrors,
          topDownKeysList
        );
        if (error && error instanceof InputErrorModel) {
          error.validate(leafValue, { data: this.state.updateProfile });
          if (error.errorText) {
            hasErrors = true;
          }
        }
      }
    );
    this.setState({
      updateProfileErrors: newUpdateProfileErrors,
    });
    return hasErrors;
  }
}
