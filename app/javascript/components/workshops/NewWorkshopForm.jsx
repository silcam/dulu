import React from "react";
import PropTypes from "prop-types";
import TextInput from "../shared/TextInput";
import AddIcon from "../shared/icons/AddIcon";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import DuluAxios from "../../util/DuluAxios";

export default class NewWorkshopForm extends React.PureComponent {
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

  createWorkshop = async () => {
    const workshop = {
      name: this.state.name
    };
    this.setState({ saving: true });
    try {
      const data = await DuluAxios.post(
        `/api/activities/${this.props.activity_id}/workshops`,
        {
          workshop: workshop
        }
      );
      this.props.handleNewWorkshop(data);
      this.setState({
        editing: false,
        saving: false,
        name: "",
        nameError: null
      });
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({
        saving: false
      });
    }
  };

  render() {
    if (this.state.editing) {
      return (
        <div>
          <TextInput
            handleInput={this.handleInput}
            name="name"
            value={this.state.name}
            placeholder={this.props.t("Workshop_name")}
            errorMessage={this.state.nameError}
            handleEnter={this.createWorkshop}
            autoFocus
          />
          <SmallSaveAndCancel
            handleSave={this.createWorkshop}
            handleCancel={this.cancelForm}
            t={this.props.t}
            saveDisabled={!this.state.name}
            saveInProgress={this.state.saving}
          />
        </div>
      );
    } else {
      return <AddIcon onClick={this.showForm} />;
    }
  }
}

NewWorkshopForm.propTypes = {
  handleNewWorkshop: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  activity_id: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};
