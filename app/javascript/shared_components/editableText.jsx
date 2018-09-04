import React from "react";

import AddIconButton from "./AddIconButton";

/*
    Required props:
        text
        value
        field
        updateValue - function
        editEnabled - boolean
    Optional props:
        placeholder
*/

function editableText(WrappedInput) {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        editing: false,
        text: props.text
      };
    }

    setEditMode = () => {
      this.setState({
        editing: true
      });
    };

    save = (value, text) => {
      if (value != this.props.value) {
        this.props.updateValue(this.props.field, value);
      }
      this.setState({
        editing: false,
        text: text
      });
    };

    cancel = () => {
      this.setState({
        editing: false,
        text: this.props.text
      });
    };

    render() {
      if (!this.props.editEnabled) return this.props.text;

      if (this.state.editing) {
        return (
          <span className="editableTextInput">
            <WrappedInput
              value={this.props.value}
              text={this.state.text}
              name={this.props.field}
              save={this.save}
              cancel={this.cancel}
              autoFocus
              {...this.props}
            />
          </span>
        );
      }
      if (!this.props.text) {
        if (this.props.placeholder) {
          return (
            <span
              className="editableText"
              onClick={this.setEditMode}
              style={{ color: "#aaa" }}
            >
              ({this.props.placeholder}) &nbsp;
              <span className="glyphicon glyphicon-pencil" />
            </span>
          );
        } else {
          return (
            <span style={{ color: "#aaa" }}>
              <AddIconButton handleClick={this.setEditMode} />
            </span>
          );
        }
      }
      return (
        <span className="editableText" onClick={this.setEditMode}>
          {this.props.text}
          &nbsp;
          <span className="glyphicon glyphicon-pencil" />
        </span>
      );
    }
  };
}

export default editableText;
