import * as React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import {
  COLLECTIONS_URL,
  PALETTES_URL,
  COLLECTIONS_EDIT_URL,
  COLLECTIONS_INFO_URL,
  COLLECTIONS_IMAGE_URL,
} from "../../../../constants/urls";

interface Props {
  buttons: any;
  explore?: boolean;
  activeMode?: string;
  activeDisplay?: string;
  background?: string;
  iconClass?: any;
  hasAnimation?: boolean;
  toggleMode?: any;
  toggleDisplay?: any;
}

const activeButtonURLS = {
  palettes: PALETTES_URL,
  collections: COLLECTIONS_URL,
  image: COLLECTIONS_IMAGE_URL,
  info: COLLECTIONS_INFO_URL,
  edit: COLLECTIONS_EDIT_URL,
};

export default class RoundButton extends React.Component<Props, any> {
  activeButtonMode: number;
  animate = null;
  animationDirection = null;

  constructor(props) {
    super(props);
    switch (this.props.activeMode) {
      case "image": {
        this.activeButtonMode = 0;
        break;
      }
      case "info": {
        this.activeButtonMode = 1;
        break;
      }
      case "edit": {
        this.activeButtonMode = 2;
        break;
      }
    }
  }

  switchDisplay(e, index, button) {
    this.props.toggleDisplay(button);
  }

  toggleAnimation(e, index, button) {
    this.animate = "true";
    this.props.toggleMode(button);
    if (this.activeButtonMode - index == 2) {
      this.animationDirection = "animated-2steps-left";
    } else if (this.activeButtonMode - index == -2) {
      this.animationDirection = "animated-2steps-right";
    } else if (this.activeButtonMode > index) {
      this.animationDirection = "animated-left";
    } else if (this.activeButtonMode < index) {
      this.animationDirection = "animated-right";
    } else {
      this.activeButtonMode = null;
    }
    this.activeButtonMode = index;
  }

  renderDisplayButtons(index, button, buttonStyling) {
    return (
      <Link
        to={COLLECTIONS_URL}
        onClick={(e) => this.switchDisplay(e, index, button)}
      >
        <div
          className={cn("button collection", buttonStyling[button])}
          key={index}
        >
          {button}
        </div>
      </Link>
    );
  }

  renderModeButtons(index, button, buttonStyling) {
    return (
      <Link
        to={activeButtonURLS[button]}
        onClick={(e) => this.toggleAnimation(e, index, button)}
      >
        <div
          className={cn(
            `${this.animationDirection}`,
            "button collection",
            buttonStyling[button]
          )}
          key={index}
        >
          {this.props.iconClass && (
            <i className={this.props.iconClass[index]}></i>
          )}
          {button}
        </div>
      </Link>
    );
  }
  renderExploreButtons(index, button, buttonStyling) {
    return (
      <div
        className={cn("button collection", buttonStyling[button])}
        key={index}
      >
        {button}
      </div>
    );
  }

  render() {
    const activeButtonMode = window.location.href.includes(COLLECTIONS_URL)
      ? "collections"
      : "palettes";
    let buttonStyling = {};
    this.props.buttons.forEach((button) => {
      buttonStyling[button] = `${this.props.background ? "grey" : ""} 
      ${
        activeButtonMode === button ||
        this.props.activeMode === button ||
        this.props.activeDisplay === button
          ? "active"
          : ""
      }`;
    });

    return (
      <React.Fragment>
        {this.props.buttons.map((button: any, index: number) => {
          return (
            <React.Fragment>
              {this.props.activeMode &&
                this.renderModeButtons(index, button, buttonStyling)}
              {this.props.activeDisplay &&
                this.renderDisplayButtons(index, button, buttonStyling)}
              {this.props.explore &&
                this.renderExploreButtons(index, button, buttonStyling)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}
