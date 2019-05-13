import React from "react";
import TextInput from "../shared/TextInput";
import AddIcon from "../shared/icons/AddIcon";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import DuluAxios from "../../util/DuluAxios";
import { IWorkshop } from "../../models/Workshop";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  handleNewWorkshop: (workshop: IWorkshop) => void;
  activity_id: number;
}

interface IState {
  editing: boolean;
  saving: boolean;
  name: string;
}

export default class NewWorkshopForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
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

  setName = (name: string) => {
    this.setState({
      name
    });
  };

  createWorkshop = async () => {
    const workshop = {
      name: this.state.name
    };
    this.setState({ saving: true });
    const data = await DuluAxios.post(
      `/api/activities/${this.props.activity_id}/workshops`,
      {
        workshop: workshop
      }
    );
    if (data) {
      this.props.handleNewWorkshop(data as IWorkshop);
      this.setState({
        editing: false,
        saving: false,
        name: ""
      });
    } else {
      this.setState({
        saving: false
      });
    }
  };

  render() {
    if (this.state.editing) {
      return (
        <I18nContext.Consumer>
          {t => (
            <div>
              <TextInput
                setValue={this.setName}
                name="name"
                value={this.state.name}
                placeholder={t("Workshop_name")}
                handleEnter={this.createWorkshop}
                autoFocus
              />
              <SmallSaveAndCancel
                handleSave={this.createWorkshop}
                handleCancel={this.cancelForm}
                saveDisabled={!this.state.name}
                saveInProgress={this.state.saving}
              />
            </div>
          )}
        </I18nContext.Consumer>
      );
    } else {
      return <AddIcon onClick={this.showForm} />;
    }
  }
}
