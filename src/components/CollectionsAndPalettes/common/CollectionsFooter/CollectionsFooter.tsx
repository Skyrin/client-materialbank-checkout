import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/CollectionsFooter/CollectionsFooter.module.scss";
import Logo from "../../../common/Logo/Logo";
import cn from "classnames";
import { isOnMobile } from "../../../../utils/responsive";

interface State {
  email: string;
}

export default class CollectionsFooter extends React.Component<any, State> {
  state: State = {
    email: "",
  };
  links = {
    about: [
      "About us",
      "Frequently Asked Questions",
      "Commitment to Sustainability",
    ],
    customer: ["Account & Orders", "Get Design Help", "Contact Us"],
  };
  renderSocialIcons = () => {
    return (
      <React.Fragment>
        <i className="fab fa-facebook-square"></i>
        <i className="fab fa-pinterest-square"></i>
        <i className="fab fa-twitter-square"></i>
        <i className="fab fa-youtube-square"></i>
        <i className="fab fa-snapchat-square"></i>
        <i className="fab fa-instagram-square"></i>
      </React.Fragment>
    );
  };
  updateField = (e: any) => {
    this.setState({
      email: e.target.value,
    });
  };
  renderInfoRowMobile = () => {
    return (
      <div className={styles.footerRowInfo}>
        <div className={styles.infoText}>
          <Logo className={styles.logoFooter} />
          <div className={cn("button", styles.footerButton)}>How It Works</div>
        </div>
        <div className={styles.infoTextParagraph}>
          Explore samples from hundreds of manufacturers with free overnight
          shipping.
          <br />
          Order by midnight, in your hands by 10:30am the next day.
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.footer}>
        {isOnMobile() && this.renderInfoRowMobile()}
        {!isOnMobile() && (
          <React.Fragment>
            <div className={styles.footerRowInfo}>
              <div className={styles.infoText}>
                <Logo className={styles.logoFooter} />
                <div>
                  Explore samples from hundreds of manufacturers with free
                  overnight shipping.
                  <br />
                  Order by midnight, in your hands by 10:30am the next day.
                </div>
              </div>
              <div className={cn("button", styles.footerButton)}>
                How It Works
              </div>
            </div>
          </React.Fragment>
        )}
        <div className={styles.footerRowLinks}>
          <div className={styles.footerLinkColumn}>
            <span className={styles.sectionTitle}> About Design Shop</span>
            {this.links &&
              this.links.about.map((link, index: number) => {
                return <a key={index}>{link}</a>;
              })}
          </div>
          <div className={styles.footerLinkColumn}>
            <span className={styles.sectionTitle}>Customer Service</span>
            {this.links &&
              this.links.customer.map((link, index: number) => {
                return <a key={index}>{link}</a>;
              })}
          </div>
          <div className={styles.newsLetter}>
            <span className={styles.sectionTitle}>Newsletter</span>
            <div className={styles.emailText}>
              Enter your email address below to recieve advice, inspiration and
              trends from Design Shop
            </div>
            <div className={styles.email}>
              <input
                className={styles.inputField}
                placeholder="You@email.com"
                value={this.state.email}
                type="email"
                name="email"
                onChange={this.updateField}
              />
              <div className={cn("button", styles.footerButton, styles.signUp)}>
                Sign Up
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="horizontal-divider-footer"></div>
          <div className={styles.footNote}>
            <div className={styles.copyRights}>
              {" "}
              © Design Shop. All Rights reserved. Design Shop is a registered
              trademark of Sandow. Privacy policy. Terms & conditions.
            </div>
            <div className={styles.socialButtons}>
              {this.renderSocialIcons()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
