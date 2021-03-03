import * as React from "react";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import CollectionCard from "../common/CollectionCard/CollectionCard";
import face1 from "../../../assets/images/face1.jpeg";
import face2 from "../../../assets/images/face2.jpg";
import letter1 from "../../../assets/images/letter1.png";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import { createCollection, getCollections } from "context/CollectionsAPI/api";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import UploadCard from "../common/UploadCard/UploadCard";

interface State {
  card: {
    id: number;
    type: string;
    title1: string;
    title2: string;
    contributors: any;
    imagePath: string;
  }[];
  collections: CollectionT[];
  loadingCollections: boolean;
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
      collections: [],
      loadingCollections: true,
    };
  }

  async componentDidMount() {
    const collections = await getCollections(this.context, {
      limit: 100,
      offset: 0,
    });
    this.setState({
      collections: collections,
      loadingCollections: false,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.cardCollection}>
          <UploadCard
            caption={"Create a Collection"}
            hasIcon
            onClick={this.createCollection}
          />
          {this.state.collections.map((collection) => {
            return (
              <Link
                to={COLLECTIONS_URL + `/${collection.id}`}
                key={`collection_${collection.id}`}
              >
                <CollectionCard collection={collection} />
              </Link>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
