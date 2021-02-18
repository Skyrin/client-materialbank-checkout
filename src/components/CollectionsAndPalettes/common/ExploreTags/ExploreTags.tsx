import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/ExploreTags/ExploreTags.module.scss";
import RoundButton from "../RoundButton/RoundButton";

export default class ExploreTags extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.exploreContainer}>
        <div className={styles.title}>
          Explore tags related to your collections
        </div>
        <div className={styles.exploreButtons}>
          <RoundButton
            buttons={[
              "farmhouse",
              "kitchen",
              "farmsink",
              "tile backsplash",
              "wood-look flooring",
              "white cabinetry",
              "tile flooring",
              "cozy color scheme",
            ]}
          />
        </div>
      </div>
    );
  }
}
