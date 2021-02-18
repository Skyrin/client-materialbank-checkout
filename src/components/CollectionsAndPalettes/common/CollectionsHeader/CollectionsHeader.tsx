import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/CollectionsHeader/CollectionsHeader.module.scss";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import CollectionsLogo from "../CollectionsLogo/CollectionsLogo";

export default class CollectionsHeader extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.Header}>
        <CollectionsLogo />
        <div className={styles.navLinks}>
          <div className={styles.navLink}>
            <a>get design samples</a>
            <i className="far fa-chevron-right" />
          </div>
          <div className={styles.navLink}>
            <a>get inspired</a>
            <i className="far fa-chevron-right" />
          </div>
        </div>
        <SearchBar
          className={styles.collectionsSearch}
          collectionHeader
          placeholder={
            "Search for flooring, paint, furniture or anything interior design"
          }
          onSearchChange={(value: string) => {
            console.log(value);
          }}
        />
        <div className={styles.headerIcons}>
          <i className="far fa-heart" />
          <i className="far fa-user-circle" />
          <i className="far fa-shopping-cart" />
        </div>
      </div>
    );
  }
}
