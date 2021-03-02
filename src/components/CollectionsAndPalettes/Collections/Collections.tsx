import * as React from "react";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import CollectionCard from "../common/CollectionCard/CollectionCard";
import UploadCard from "../common/UploadCard/UploadCard";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../context/AppContext";

interface State {
  card: {
    id: number;
    type: string;
    title1: string;
    title2: string;
    collaborators: any;
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
          collaborators: [
            "https://vanishingportrait.com/wp-content/uploads/2019/05/tiffanytrenda-vanishingportrait-identity.jpg",
            "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?size=626&ext=jpg",
            "https://i.pinimg.com/originals/9c/a9/b2/9ca9b293ed52b3a124b802449eb653d0.jpg",
            "https://www.adobe.com/content/dam/cc/us/en/creativecloud/photography/discover/portrait-photography/CODERED_B1_portrait_photography-P4a_438x447.jpg.img.jpg",
          ],
          imagePath:
            "https://upload.wikimedia.org/wikipedia/commons/7/76/Color_icon_violet_v2.svg",
        },
      ],
    };
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
          {this.state.card.map((item: any, index: number) => {
            return (
              <Link to={COLLECTIONS_URL + `/${this.state.card[index].id}`}>
                <CollectionCard item={this.state.card[index]} />
              </Link>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
