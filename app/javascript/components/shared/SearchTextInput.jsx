import React from "react";
import searchInterface from "./searchInterface";
import styles from "./SearchTextInput.css";
import PropTypes from "prop-types";

class BasicSearchTextInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.freshState();
  }

  freshState = () => ({
    text: this.props.text || "",
    selection: -1,
    showResults: false
  });

  handleChange = e => {
    this.setState({
      text: e.target.value,
      showResults: true
    });
    this.props.updateQuery(e.target.value);
    if (e.target.value == "" && this.props.allowBlank)
      this.save({
        id: null,
        name: ""
      });
  };

  handleKeyDown = e => {
    switch (e.key) {
      case "ArrowUp":
        this.moveSelectionUp();
        return;
      case "ArrowDown":
        this.moveSelectionDown();
        return;
      case "Enter":
      case "Tab":
        this.handleEnter();
        return;
    }
  };

  moveSelectionUp = () => {
    this.setState(prevState => {
      let selection = prevState.selection;
      if (selection > -1) --selection;
      return {
        selection: selection
      };
    });
  };

  moveSelectionDown = () => {
    this.setState((prevState, props) => {
      let selection = prevState.selection;
      if (selection < props.results.length - 1) ++selection;
      return {
        selection: selection
      };
    });
  };

  setSelection = index => {
    this.setState({ selection: index });
  };

  clearSelection = () => {
    this.setState({ selection: -1 });
  };

  handleBlur = () => {
    if (this.props.allowBlank && this.state.text.length == 0)
      this.save({ name: "", id: null });
    this.setState(this.freshState());
  };

  handleEnter = () => {
    if (this.props.results[this.state.selection]) {
      this.save(this.props.results[this.state.selection]);
    } else if (this.props.results[0]) {
      this.save(this.props.results[0]);
    } else if (this.props.allowBlank) {
      this.save({
        name: "",
        id: null
      });
    }
  };

  save = item => {
    this.setState({
      text: this.props.addBox ? "" : item.name,
      showResults: false
    });
    this.props.updateValue(item);
  };

  render() {
    const placeholder = this.props.placeholder || "";
    return (
      <div className={styles.searchTextInput}>
        <input
          type="text"
          name="query"
          value={this.state.text}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          placeholder={placeholder}
          autoFocus={this.props.autoFocus}
        />
        {this.state.showResults && (
          <ul onMouseLeave={this.clearSelection}>
            {this.props.results.map((country, index) => {
              const className =
                index == this.state.selection ? styles.selected : "";
              return (
                <li
                  key={country.id}
                  className={className}
                  onMouseDown={() => {
                    this.save(country);
                  }}
                  onMouseEnter={() => {
                    this.setSelection(index);
                  }}
                >
                  {country.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

BasicSearchTextInput.propTypes = {
  text: PropTypes.string,
  updateQuery: PropTypes.func,
  results: PropTypes.array,
  updateValue: PropTypes.func,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  allowBlank: PropTypes.bool,
  addBox: PropTypes.bool
};

const SearchTextInput = searchInterface(BasicSearchTextInput, 2);

SearchTextInput.propTypes = {
  queryPath: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired, // Sets the text when not actively editing
  updateValue: PropTypes.func.isRequired, // updateValue(item)
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  allowBlank: PropTypes.bool,
  addBox: PropTypes.bool
};

export default SearchTextInput;
