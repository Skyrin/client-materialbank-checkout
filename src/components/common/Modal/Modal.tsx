import React from "react";
import cn from "classnames";
import styles from "./Modal.module.scss";

interface State {
  content: any;
}

export class Modal extends React.Component<{}, State> {
  state: State = {
    content: null,
  };

  // When you call the open method, you have to pass JSX as its parameter
  public open(content: any): void {
    this.setState({ content });
  }

  public close(): void {
    this.setState({ content: null });
  }

  render() {
    if (this.state.content) {
      return (
        <div className={cn(styles["Modal"])}>
          <div
            className={cn(styles["background"])}
            onClick={() => this.close()}
          ></div>
          <div className={cn(styles["content"])}>
            {React.cloneElement(this.state.content, {
              close: () => this.close(),
            })}
          </div>
        </div>
      );
    }
    return null;
  }
}
