import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  PageOption,
} from "components/UserManagement/UserHeader/UserHeader";

type Props = RouteComponentProps;

export default class UserBilling extends React.Component<Props, any> {
  render() {
    return <UserHeader title={PageOption.Billing} />;
  }
}
