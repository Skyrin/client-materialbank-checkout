import * as React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import {
  COLLECTIONS_EDIT_URL,
  COLLECTIONS_IMAGE_URL,
  COLLECTIONS_INFO_URL,
  COLLECTIONS_URL,
} from "../../../constants/urls";
import CollectionsImage from "./CollectionsImage/CollectionsImage";
import CollectionsInfo from "./CollectionsInfo/CollectionsInfo";
import CollectionsEdit from "./CollectionsEdit/CollectionsEdit";

export default class Collections extends React.Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <h1>collections</h1>
        <Switch>
          <Redirect exact from={COLLECTIONS_URL} to={COLLECTIONS_IMAGE_URL} />
          <Route path={COLLECTIONS_IMAGE_URL} component={CollectionsImage} />
          <Route path={COLLECTIONS_INFO_URL} component={CollectionsInfo} />
          <Route path={COLLECTIONS_EDIT_URL} component={CollectionsEdit} />
        </Switch>
        <Link to={COLLECTIONS_IMAGE_URL}>Image</Link>
        <Link to={COLLECTIONS_INFO_URL}>Info</Link>
        <Link to={COLLECTIONS_EDIT_URL}>Edit</Link>
      </React.Fragment>
    );
  }
}
