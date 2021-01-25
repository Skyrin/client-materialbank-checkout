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
  onAddressSelected?: (addressText: string, addressInfo: any) => void;
};

type Suggestion = {
  text: string;
  id: string;
};

type State = {
  inputValue: string;
  userInputValue: string;
  initialValue: string;
  suggestions: Suggestion[];
  selectedSuggestionIndex: number;
};

const AutocompleteLookup = SmartyStreetsSDK.usAutocomplete.Lookup;

export default class AddressInput extends React.Component<Props, State> {
  autocompleteClient!: SmartyStreetsSDK.core.Client<SmartyStreetsSDK.usAutocomplete.Lookup>;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.initialValue || "",
      userInputValue: props.initialValue || "",
      initialValue: props.initialValue || "",
      suggestions: [],
      selectedSuggestionIndex: -1,
    };
  }

  async componentDidMount() {
    this.props.componentRef && this.props.componentRef(this);
    console.log(SmartyStreetsSDK);
    // TODO: REMOVE KEY FROM CODE!
    const credentials = new SmartyStreetsSDK.core.SharedCredentials(
      process.env.REACT_APP_SMARTYSTREETS_CLIENT_KEY || "30500088655303291"
    );
    // console.log('SET CREDENTIALS UP WITH', process.env.REACT_APP_SMARTYSTREETS_CLIENT_KEY);
    this.autocompleteClient = SmartyStreetsSDK.core.buildClient.usAutocomplete(
      credentials
    );
    const response = await this.autocompleteClient.send(
      new AutocompleteLookup("rd")
    );
    console.log(response);
  }

  handleChange = (newVal: string) => {
    this.setState({
      inputValue: newVal,
      userInputValue: newVal,
      selectedSuggestionIndex: -1,
    });
    if (!newVal) {
      // Allow the user to clear the address
      this.props.onAddressSelected("", {});
    }
    this.debouncedFetchSuggestions();
  };

  // To be used from the outside through componentRef
  updateValue = (newVal: string) => {
    console.log("UPDATE VALUE", newVal);
  };

  selectSuggestion = (index: number) => {
    if (index > this.state.suggestions.length - 1) {
      return;
    }

    if (index === -1) {
      this.setState({
        selectedSuggestionIndex: index,
        inputValue: this.state.userInputValue,
      });
    } else {
      this.setState({
        selectedSuggestionIndex: index,
        inputValue: this.state.suggestions[index].text,
      });
    }
  };

  confirmSelection = (index: number) => {
    if (index >= 0 && index < this.state.suggestions.length) {
      const selectedAddress = this.state.suggestions[index];
      this.setState({
        inputValue: selectedAddress.text,
        selectedSuggestionIndex: -1,
        suggestions: [],
        initialValue: selectedAddress.text,
      });
      this.props.onAddressSelected(selectedAddress.text, {});
      window.removeEventListener("keydown", this.handleKeyDown);
    }
  };

  cancelSelection = () => {
    window.setTimeout(() => {
      if (this.state.suggestions.length > 0) {
        this.setState({
          inputValue: this.state.initialValue,
          userInputValue: this.state.initialValue,
          selectedSuggestionIndex: -1,
          suggestions: [],
        });
        window.removeEventListener("keydown", this.handleKeyDown);
      }
    }, 100);
  };

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (
          this.state.selectedSuggestionIndex <
          this.state.suggestions.length - 1
        ) {
          this.selectSuggestion(this.state.selectedSuggestionIndex + 1);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (this.state.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.state.selectedSuggestionIndex - 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          this.state.selectedSuggestionIndex >= 0 &&
          this.state.selectedSuggestionIndex < this.state.suggestions.length
        ) {
          this.confirmSelection(this.state.selectedSuggestionIndex);
        }
        break;
      case "Escape":
        e.preventDefault();
        if (this.state.suggestions.length > 0) {
          this.setState({
            inputValue: "",
            userInputValue: "",
            selectedSuggestionIndex: -1,
            suggestions: [],
          });
        }
        break;
      default:
        break;
    }
  };

  fetchSuggestions = () => {
    const input = this.state.inputValue;
    if (!input) {
      return;
    }

    console.log("SHOULD FETCH", input);
    const suggestions = [
      {
        text: "Suggestion 1",
        id: "1234",
      },
      {
        text: "Suggestion 2",
        id: "2345",
      },
    ];
    this.setState({
      suggestions: suggestions,
    });
    if (suggestions.length > 0) {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  };

  debouncedFetchSuggestions = debounce(this.fetchSuggestions, 400);

  render() {
    return (
      <div className={styles.addressInputWrapper}>
        <Input
          className={cn(styles.input, {
            [styles.hasSuggestions]: this.state.suggestions.length > 0,
          })}
          value={this.state.inputValue}
          onChange={(newVal) => this.handleChange(newVal)}
          onBlur={() => {
            this.cancelSelection();
          }}
          placeholder={this.props.placeholder || "Address"}
        />
        {this.state.suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {this.state.suggestions.map((s, index) => (
              <div
                key={s.id}
                className={cn(styles.suggestion, {
                  [styles.selected]:
                    index === this.state.selectedSuggestionIndex,
                })}
                onClick={(e) => {
                  this.confirmSelection(index);
                }}
              >
                {s.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
