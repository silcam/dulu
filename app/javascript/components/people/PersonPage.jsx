import React from "react";
import PersonActionBar from "./PersonActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import merge from "deepmerge";
import SaveIndicator from "../shared/SaveIndicator";
import PersonBasicInfo from "./PersonBasicInfo";

export default class PersonPage extends React.PureComponent {
  state = {
    person: deepcopy(this.props.person)
  };

  updatePerson = mergePerson => {
    this.setState(prevState => ({
      person: merge(prevState.person, mergePerson)
    }));
  };

  save = async () => {
    this.setState({ saving: true });
    const newPerson = await this.props.updatePerson(this.state.person);
    this.setState({
      editing: false,
      saving: false,
      savedChanges: true,
      person: newPerson
    });
  };

  render() {
    const person = this.state.person;

    return (
      <div>
        <PersonActionBar
          can={person.can}
          editing={this.state.editing}
          t={this.props.t}
          edit={() => this.setState({ editing: true })}
          delete={() => this.setState({ deleting: true })}
          save={this.save}
          cancel={() =>
            this.setState({
              editing: false,
              person: deepcopy(this.props.person)
            })
          }
        />

        <SaveIndicator
          t={this.props.t}
          saving={this.state.saving}
          saved={this.state.savedChanges}
        />

        <h2>
          <TextOrEditText
            editing={this.state.editing}
            value={person.first_name}
            updateValue={value => this.updatePerson({ first_name: value })}
          />
          &nbsp;
          <TextOrEditText
            editing={this.state.editing}
            value={person.last_name}
            updateValue={value => this.updatePerson({ last_name: value })}
          />
        </h2>

        <PersonBasicInfo
          t={this.props.t}
          person={person}
          editing={this.state.editing}
          updatePerson={this.updatePerson}
        />
      </div>
    );
  }
}
