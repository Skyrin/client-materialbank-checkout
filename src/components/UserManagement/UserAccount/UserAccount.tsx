import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

type Props = RouteComponentProps;

export default class UserAccount extends React.Component<Props, any> {
  render() {
    return "User Account Page";
  }
}
