import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/CollectionsLogo/CollectionsLogo.module.scss";
import { MAIN_SHOP_URL } from "constants/urls";

export default function CollectionsLogo(props: any) {
  return (
    <a href={MAIN_SHOP_URL} className={styles.collectionLogo}>
      <div>
        <svg viewBox="0 0 78 79" xmlns="http://www.w3.org/2000/svg">
          <path
            className={styles.logoPath}
            d="M60.244 41.6c0 9.73-7.788 17.617-17.395 17.617H23.253a1.867 1.867 0 01-1.855-1.879V21.752c0-1.038.83-1.88 1.855-1.88h19.596c9.607 0 17.395 7.888 17.395 17.618v4.11zM38.955.09C17.441.09 0 17.754 0 39.545 0 61.335 17.44 79 38.955 79c21.515 0 38.956-17.665 38.956-39.455S60.47.09 38.955.09z"
          ></path>
        </svg>
      </div>
      <h1 className={styles.logoText}>design.shop</h1>
    </a>
  );
}
