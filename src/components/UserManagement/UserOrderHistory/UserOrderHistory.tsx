import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader, {
  UserPages,
} from "components/UserManagement/UserHeader/UserHeader";
import { SearchBar } from "components/common/SearchBar/SearchBar";

type Props = RouteComponentProps;

export default class UserOrderHistory extends React.Component<Props, any> {
  render() {
    return (
      <UserHeader
        title={UserPages.OrderHistory.name}
        extraContent={
          <SearchBar
            placeholder={"Search of order history"}
            onSearchChange={(value: string) => {
              console.log(value);
            }}
          />
        }
      />
    );
  }
}
