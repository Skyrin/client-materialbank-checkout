import * as React from "react";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import CollectionCard from "../common/CollectionCard/CollectionCard";
import face1 from "../../../assets/images/face1.jpeg";
import face2 from "../../../assets/images/face2.jpg";
import letter1 from "../../../assets/images/letter1.png";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import UploadCard from "../common/UploadCard/UploadCard";
import MoreIdeas from "../common/MoreIdeas/MoreIdeas";
import Loader from "components/common/Loader/Loader";

interface State {
  card: {
    id: number;
    type: string;
    title1: string;
    title2: string;
    contributors: any;
    imagePath: string;
  }[];
}

export default class Collections extends React.Component<any, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;
  createCollection = () => {
    this.context.openModal(Modals.CreateCollection);
  };

  constructor(props) {
    super(props);
    this.state = {
      card: [
        {
          id: 1,
          type: "collection",
          title1: "collection",
          title2: "Rhonda Roomdesigner",
          contributors: [face1, face2, letter1, face1, face2, letter1, face1],
          imagePath:
            "https://upload.wikimedia.org/wikipedia/commons/7/76/Color_icon_violet_v2.svg",
        },
      ],
    };
  }

  async componentDidMount() {
    await this.context.requestCollections({
      limit: 100,
      offset: 0,
    });
  }

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
        <MoreIdeas headerText="More ideas for you" />
      </React.Fragment>
    );
  }
}
