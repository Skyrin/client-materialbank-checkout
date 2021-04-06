import styles from "components/common/SearchBar/SearchBar.module.scss";
import searchIcon from "assets/images/search_icon.svg";
import * as React from "react";
import cn from "classnames";

type Props = {
  placeholder: string;
  className?: string;
  collectionHeader?: boolean;
  onSubmitSearch?: Function;
};
export function SearchBar(props: Props) {
  return (
    <div
      className={cn(
        styles.searchBar,
        props.className,
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
        onKeyDown={(event) => {
          props.onSubmitSearch(event);
        }}
      />
    </div>
  );
}
