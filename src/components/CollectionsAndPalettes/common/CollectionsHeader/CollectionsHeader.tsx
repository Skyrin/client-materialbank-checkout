import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/CollectionsHeader/CollectionsHeader.module.scss";
import { SearchBar } from "components/common/SearchBar/SearchBar";
import Logo from "../../../common/Logo/Logo";
import { isOnMobile } from "../../../../utils/responsive";
import cn from "classnames";

interface HeaderProps {
  isMenuOpened: boolean;
  isSearchOpened: boolean;
}

export default class CollectionsHeader extends React.Component<
  any,
  HeaderProps
> {
  wrapperRefMenu: any;
  wrapperRefSearch: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isMenuOpened: false,
      isSearchOpened: false,
    };
    this.wrapperRefMenu = React.createRef();
    this.wrapperRefSearch = React.createRef();
  }

  handleClickOutside = (evt: any) => {
    if (
      isOnMobile() &&
      this.wrapperRefMenu &&
      !this.wrapperRefMenu.current.contains(evt.target)
    ) {
      this.setState({ isMenuOpened: false });
    }
    if (
      isOnMobile() &&
      this.wrapperRefSearch &&
      !this.wrapperRefSearch.current.contains(evt.target)
    ) {
      this.setState({ isSearchOpened: false });
    }
  };

  toggleMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };

  toggleSearch = () => {
    this.setState({ isSearchOpened: !this.state.isSearchOpened });
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  renderDesktopIcons = () => {
    return (
      <React.Fragment>
        <i className="far fa-heart" />
        <i className="far fa-user-circle" />
        <i className="far fa-shopping-cart" />
      </React.Fragment>
    );
  };

  renderMobileIcons = () => {
    return (
      <div ref={this.wrapperRefSearch} className={styles.mobileIcons}>
        <a onClick={this.toggleSearch}>
          {this.state.isSearchOpened ? (
            <i className="far fa-chevron-left"></i>
          ) : (
            <i className="far fa-search"></i>
          )}
        </a>
        <div
          className={cn(
            styles.searchContainer,
            `${this.state.isSearchOpened ? styles.display : styles.hide}`
          )}
        >
          <p>
            Search for rooms, design styles, brands, and materials like paint,
            textiles, flooring…
          </p>
          <SearchBar
            className={styles.searchContainer}
            collectionHeader
            placeholder={"Search Design Shop "}
            onSearchChange={(value: string) => {
              console.log(value);
            }}
          />
        </div>
        <i className="far fa-shopping-cart" />
      </div>
    );
  };

  renderMobileHeader = () => {
    return (
      <div className={styles.Header}>
        <div ref={this.wrapperRefMenu} className={styles.mobileLogo}>
          <a onClick={this.toggleMenu}>
            {this.state.isMenuOpened ? (
              <i className="fal fa-times"></i>
            ) : (
              <i className="far fa-bars"></i>
            )}
          </a>
          <div
            className={cn(
              styles.hamburgerMenu,
              `${this.state.isMenuOpened ? styles.display : styles.hide}`
            )}
          >
            <a>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNpc6DbICSHt31iHPg7h4hUewU0K-VQUD_5A&usqp=CAU"
                }
              />
              <div className={styles.account}>
                <span>Hi,</span>
                <span>Your account</span>
              </div>
            </a>
            <a>remodel & renovate</a>
            <a>styles & ideas</a>
          </div>
          <Logo className={styles.headerLogo} header />
        </div>
        <div className={styles.headerIcons}>{this.renderMobileIcons()}</div>
      </div>
    );
  };

  renderDesktopHeader = () => {
    return (
      <div className={styles.Header}>
        <Logo className={styles.headerLogo} header />
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
        <div className={styles.headerIcons}>{this.renderDesktopIcons()}</div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {isOnMobile() && this.renderMobileHeader()}
        {!isOnMobile() && this.renderDesktopHeader()}
      </React.Fragment>
    );
  }
}
