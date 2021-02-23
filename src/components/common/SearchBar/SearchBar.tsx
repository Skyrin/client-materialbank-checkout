import styles from "components/common/SearchBar/SearchBar.module.scss";
import searchIcon from "assets/images/search_icon.svg";
import * as React from "react";
import cn from "classnames";

type Props = {
  placeholder: string;
  onSearchChange: Function;
  className?: string;
  collectionHeader?: boolean;
};

export function SearchBar(props: Props) {
  return (
    <div
      className={cn(
        styles.searchBar,
        props.collectionHeader ? styles.collectionsSearch : ""
      )}
    >
      {props.collectionHeader ? (
        <i className="fal fa-search" />
      ) : (
        <img src={searchIcon} alt="Search Icon" className={styles.searchIcon} />
      )}
      <input
        type="text"
        className={styles.searchInput}
        placeholder={props.placeholder}
        onChange={(event) => {
          props.onSearchChange(event.target.value);
        }}
      />
    </div>
  );
}
