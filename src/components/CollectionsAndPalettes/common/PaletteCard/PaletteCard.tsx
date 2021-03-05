import { PaletteT } from "constants/types";
import * as React from "react";
import styles from "../../common/ItemCard/ItemCard.module.scss";
import Contributors from "../Contributors/Contributors";
import cn from "classnames";

interface Props {
  palette: PaletteT;
}

export default class PaletteCard extends React.Component<Props, any> {
  renderVisibility = () => {
    const { palette } = this.props;
    if (palette.isPublic) {
      return `Shared (${palette.collaborators.length} people)`;
    }
    return `Private`;
  };

  render() {
    const { palette } = this.props;

    const imagePath =
      "https://www.thespruce.com/thmb/p9w1-npa3PbgpTOa5ng7uWNmTfs=/828x399/filters:no_upscale():max_bytes(150000):strip_icc()/7XghHk_full2-b3835383b6924afe8d082db04ba7aad5.jpg";
    return (
      <div className={styles.itemCard}>
        <div className={styles.imageContainer}>
          <img src={imagePath} alt="" />
        </div>
        <div
          className={cn(
            styles.infoContainer,
            !palette.isPublic ? styles.privateCard : ""
          )}
        >
          <div className={styles.textContainer}>
            <div className={styles.darker}>{palette.name}</div>
            {palette.collaborators && (
              <Contributors small contributors={palette.collaborators} />
            )}
          </div>
          <div>
            {!palette.isPublic && <i className={"far fa-lock"} />}
            {this.renderVisibility()}
          </div>
        </div>
      </div>
    );
  }
}
