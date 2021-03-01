import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/ExploreTags/ExploreTags.module.scss";
import RoundButtons from "../RoundButtons/RoundButtons";

export default class ExploreTags extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.exploreContainer}>
        <div className="horizontal-divider margin-top" />

        <div className={styles.title}>
          Explore tags related to your collections
        </div>
        <div className={styles.exploreButtons}>
          <RoundButtons
            buttons={this.props.buttons}
            onButtonSelected={null}
            selectedButton={null}
          />
        </div>
      </div>
    );
  }
}
