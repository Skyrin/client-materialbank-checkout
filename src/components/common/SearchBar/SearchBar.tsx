import styles from "components/common/SearchBar/SearchBar.module.scss";
import searchIcon from "assets/images/search_icon.svg";
import * as React from "react";

type Props = {
  placeholder: string;
  onSearchChange: Function;
};

export function SearchBar(props: Props) {
  return (
    <div className={styles.searchBar}>
      <img src={searchIcon} alt="Search Icon" className={styles.searchIcon} />
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
