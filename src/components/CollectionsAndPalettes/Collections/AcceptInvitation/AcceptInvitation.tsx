import * as React from "react";
import { AppContext, AppContextState } from "../../../../context/AppContext";
import { acceptInvitation } from "../../../../context/CollectionsAPI/api";
import { COLLECTIONS_URL } from "../../../../constants/urls";

export default class AcceptInvitation extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;

  async componentDidMount() {
    let token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      const resp = await acceptInvitation(
        this.context,
        // id, //TODO figure out where this will come from
        15,
        token
      );
      console.log("accept invite response", resp);
      this.props.history.push(COLLECTIONS_URL);
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    return <h1>Accept invite</h1>;
  }
}
