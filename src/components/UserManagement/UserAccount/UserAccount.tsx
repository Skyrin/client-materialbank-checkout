import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";

type Props = RouteComponentProps;

export default class UserAccount extends React.Component<Props, any> {
  render() {
    return <UserHeader title={UserPages.Account.name} />;
  }
}
