import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";

type Props = RouteComponentProps;

export default class UserShipping extends React.Component<Props, any> {
  render() {
    return (
      <UserHeader
        title={UserPages.Shipping.name}
        extraContent={
          <SearchBar
            placeholder={"Search of shipping address"}
            onSearchChange={(value: string) => {
              console.log(value);
            }}
          />
        }
      />
    );
  }
}
