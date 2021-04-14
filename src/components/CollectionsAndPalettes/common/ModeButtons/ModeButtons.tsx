import * as React from "react";
import cn from "classnames";
import styles from "./ModeButtons.module.scss";

interface Props {
  buttons: string[];
  selectedButton: string;
  onButtonSelected: Function;
  buttonClassName?: string;
  activeButtonClassName?: string;
  iconClass: string[];
}

export default class ModeButtons extends React.Component<Props, any> {
  activeButtonMode = 0;

  toggleAnimation = (e, index, button) => {
    this.props.onButtonSelected(button);
    this.activeButtonMode = index;
  };

  renderModeButton = (index, button) => {
    return (
      <div
        onClick={(e) => this.toggleAnimation(e, index, button)}
        className={"button collection mode"}
        key={index}
      >
        <i className={this.props.iconClass[index]}></i>
        {button}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.buttons.map((button: any, index: number) => {
          return this.renderModeButton(index, button);
        })}
        <div
          style={{
            left: `${
              (this.activeButtonMode / this.props.buttons.length) * 100
            }%`,
          }}
          className={cn("button collection mode", styles.floatingButton)}
        >
          <i className={this.props.iconClass[this.activeButtonMode]}></i>
          {this.props.selectedButton}
        </div>
      </React.Fragment>
    );
  }
}
