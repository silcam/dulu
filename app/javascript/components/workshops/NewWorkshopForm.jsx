import React from "react";
import axios from "axios";

import AddIconButton from "../../shared_components/AddIconButton";
import TextInput from "../../shared_components/TextInput";
import SaveButton from "../../shared_components/SaveButton";
import CancelButton from "../../shared_components/CancelButton";

/*
    Required props
        function handleNewWorkshop
        string authenticity_token
*/

class NewWorkshopForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      saving: false,
      name: ""
    };
  }

  showForm = () => {
    this.setState({
      editing: true,
      saving: false
    });
  };

  cancelForm = () => {
    this.setState({
      editing: false,
      saving: false
    });
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value,
      nameError: null
    });
  };

  createWorkshop = () => {
    if (this.validate()) {
      const workshop = {
        name: this.state.name
      };
      this.setState({ saving: true });
      axios
        .post(`/api/activities/${this.props.activity_id}/workshops`, {
          authenticity_token: this.props.authenticity_token,
          workshop: workshop
        })
        .then(response => {
          this.props.handleNewWorkshop(response.data);
          this.setState({
            editing: false,
            saving: false,
            name: "",
            nameError: null
          });
        })
        .catch(error => console.error(error));
    } else {
      this.setState({ nameError: this.props.strings.Name_not_blank });
    }
  };

  validate = () => {
    // valid if name not blank
    return this.state.name;
  };

  render() {
    if (this.state.editing) {
      return (
        <div>
          <TextInput
            handleInput={this.handleInput}
            name="name"
            value={this.state.name}
            placeholder={this.props.strings.Workshop_name}
            errorMessage={this.state.nameError}
            handleEnter={this.createWorkshop}
          />
          <SaveButton
            handleClick={this.createWorkshop}
            saveInProgress={this.state.saving}
            strings={this.props.strings}
          />
          &nbsp;
          <CancelButton
            handleClick={this.cancelForm}
            strings={this.props.strings}
          />
        </div>
      );
    } else {
      return (
        <AddIconButton
          handleClick={this.showForm}
          text={this.props.strings.Add_workshop}
        />
      );
    }
  }
}

export default NewWorkshopForm;
