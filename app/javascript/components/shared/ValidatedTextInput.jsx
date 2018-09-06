import React from "react";

import TextInput from "./TextInput";

/*
    Required props:
        handleInput(e)
        value
        name
        strings
    Options props:
        validateNotBlank - bool
        ...see TextInput
*/

class ValidatedTextInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showError: false };
  }

  handleInput = e => {
    this.props.handleInput(e);

    if (!this.state.showError) {
      this.setState({ showError: true });
    }
  };

  makeErrorMessage = () => {
    if (!this.state.showError && !this.props.showError) {
      return null;
    }
    if (this.props.validateNotBlank && this.props.value.length == 0) {
      return this.props.t("validation.Not_blank");
    }
    return null;
  };

  render() {
    const { handleInput, ...otherProps } = this.props;
    const errorMessage = this.makeErrorMessage();

    return (
      <TextInput
        handleInput={this.handleInput}
        errorMessage={errorMessage}
        {...otherProps}
      />
    );
  }
}

export default ValidatedTextInput;
