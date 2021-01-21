import * as React from "react";
import Input from "../Input";
import cn from "classnames";
import { debounce } from "lodash-es";
import styles from "./AddressInput.module.scss";
import SmartyStreetsSDK from "smartystreets-javascript-sdk";

type Props = {
  initialValue?: string;
  placeholder?: string;
  componentRef?: Function;
};

type Suggestion = {
  text: string;
  id: string;
};

type State = {
  inputValue: string;
  suggestions: Suggestion[];
};

const AutocompleteLookup = SmartyStreetsSDK.usAutocomplete.Lookup;

export default class AddressInput extends React.Component<Props, State> {
  autocompleteClient!: SmartyStreetsSDK.core.Client<SmartyStreetsSDK.usAutocomplete.Lookup>;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.initialValue || "",
      suggestions: [
        {
          text: "Suggestion 1",
          id: "1234",
        },
        {
          text: "Suggestion 2",
          id: "2345",
        },
      ],
    };
  }

  async componentDidMount() {
    this.props.componentRef && this.props.componentRef(this);
    console.log(SmartyStreetsSDK);
    // const credentials = new SmartyStreetsSDK.core.StaticCredentials('480d9b36-2536-0cfb-dd15-ad7bf6009355', 'EcFfc4it2KVbRoX8b6uw');
    const credentials = new SmartyStreetsSDK.core.SharedCredentials(
      process.env.REACT_APP_SMARTYSTREETS_CLIENT_KEY
    );
    // console.log('SET CREDENTIALS UP WITH', process.env.REACT_APP_SMARTYSTREETS_CLIENT_KEY);
    this.autocompleteClient = SmartyStreetsSDK.core.buildClient.usAutocomplete(
      credentials
    );
    const response = await this.autocompleteClient.send(
      new AutocompleteLookup("Test")
    );
  }

  handleChange = (newVal: string) => {
    console.log("ADDRESS CHANGED", newVal);
    this.setState({
      inputValue: newVal,
    });
    this.debouncedFetchSuggestions();
  };

  // To be used from the outside through componentRef
  updateValue = (newVal: string) => {
    console.log("UPDATE VALUE", newVal);
  };

  fetchSuggestions = () => {
    const input = this.state.inputValue;
    console.log("SHOULD FETCH", input);
    this.setState({
      suggestions: [
        {
          text: "Suggestion 1",
          id: "1234",
        },
        {
          text: "Suggestion 2",
          id: "2345",
        },
      ],
    });
  };

  debouncedFetchSuggestions = debounce(this.fetchSuggestions, 400);

  render() {
    return (
      <div className={styles.addressInputWrapper}>
        <Input
          className={cn({
            [styles.hasSuggestions]: this.state.suggestions.length > 0,
          })}
          value={this.state.inputValue}
          onChange={(newVal) => this.handleChange(newVal)}
          placeholder={this.props.placeholder || "Address"}
        />
        {this.state.suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {this.state.suggestions.map((s) => (
              <div className={styles.suggestion} key={s.id}>
                {s.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
