import * as React from "react";
import { AppContext, AppContextState } from "../../../../context/AppContext";
import { acceptInvitation } from "../../../../context/CollectionsAPI/api";
import { COLLECTIONS_URL, goToStorefront } from "../../../../constants/urls";

export default class AcceptInvitation extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    let collectionId: any = params.get("collection");
    if (collectionId) {
      collectionId = parseInt(collectionId);
    }
    if (token && collectionId) {
      const resp = await acceptInvitation(this.context, collectionId, token);
      console.log("accept invite response", resp);
      this.props.history.push(COLLECTIONS_URL);
    } else {
      goToStorefront();
    }
  }

  render() {
    return <h1>Accept invite</h1>;
  }
}
