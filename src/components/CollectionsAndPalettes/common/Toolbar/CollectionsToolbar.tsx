import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/Toolbar/CollectionsToolbar.module.scss";
import RoundButton from "../RoundButton/RoundButton";

interface Props {
  title: string;
}

export default class CollectionsToolbar extends React.Component<Props, any> {
  render() {
    return (
      <div className={styles.toolbarContainer}>
        <div className={styles.title}>{this.props.title}</div>
        <div className="horizontal-divider-collections"></div>
        <div className={styles.toolbarContent}>
          <div className={styles.navigationButtons}>
            <RoundButton
              buttons={["collections", "palettes"]}
              background={"grey"}
            />
          </div>
          <div className={styles.noOfCollections}>4 Collections</div>
        </div>
      </div>
    );
  }
}
