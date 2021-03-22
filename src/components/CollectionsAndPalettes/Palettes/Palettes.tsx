import * as React from "react";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import { AppContext, AppContextState } from "context/AppContext";
import UploadCard from "../common/UploadCard/UploadCard";
import MoreIdeas from "../common/MoreIdeas/MoreIdeas";
import Loader from "components/common/Loader/Loader";
import PaletteCard from "../common/PaletteCard/PaletteCard";
import { PaletteT } from "../../../constants/types";

interface State {
  card: PaletteT[];
}

export default class Palettes extends React.Component<any, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props) {
    super(props);
    this.state = {
      card: [
        {
          id: 1,
          name: "Fun textures",
          isPublic: false,
        },
      ],
    };
  }

  // async componentDidMount() {
  //   await this.context.requestCollections({
  //     limit: 100,
  //     offset: 0,
  //   });
  // }

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
                caption={"Build a Palette on Design Desk"}
                icon={"far fa-wrench"}
              />
              {this.state.card.map((palette) => {
                return <PaletteCard palette={palette} />;
              })}
            </React.Fragment>
          )}
        </div>
        <MoreIdeas headerText="More ideas for you" />
      </React.Fragment>
    );
  }
}
