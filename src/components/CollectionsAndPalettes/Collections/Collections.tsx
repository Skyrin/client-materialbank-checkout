import * as React from "react";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import CollectionCard from "../common/CollectionCard/CollectionCard";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import UploadCard from "../common/UploadCard/UploadCard";
import Loader from "components/common/Loader/Loader";
import MoreIdeas from "../common/MoreIdeas/MoreIdeas";

export default class Collections extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  createCollection = () => {
    this.context.openModal(Modals.CreateCollection);
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.cardCollection}>
          {this.context.collectionsLoading ? (
            <Loader
              containerClassName={styles.loaderContainer}
              loaderClassName={styles.loader}
            />
          ) : (
            <React.Fragment>
              <UploadCard
                caption={"Create a Collection"}
                icon={"far fa-plus"}
                onClick={this.createCollection}
              />
              {this.context.collections.map((collection) => {
                return (
                  <Link
                    to={COLLECTIONS_URL + `/${collection.id}`}
                    key={`collection_${collection.id}`}
                  >
                    <CollectionCard collection={collection} />
                  </Link>
                );
              })}
            </React.Fragment>
          )}
        </div>
        {/*<MoreIdeas headerText="More ideas for you" />*/}
      </React.Fragment>
    );
  }
}
