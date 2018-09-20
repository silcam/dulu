import React from "react";
import styles from "../shared/MasterDetail.css";
import PeopleTable from "./PeopleTable";
import NewPersonForm from "./NewPersonForm";
import PersonPage from "./PersonPage";
import Loading from "../shared/Loading";
import { personCompare, sameName } from "../../models/person";
import thingBoard from "../shared/thingBoard";

class Board extends React.PureComponent {
  state = {};

  findDuplicate = newPerson => {
    return this.props.people.find(person => sameName(person, newPerson));
  };

  addPerson = async person => {
    const duplicate = !person.not_a_duplicate && this.findDuplicate(person);
    if (duplicate) {
      this.setState({ duplicatePerson: duplicate });
    } else {
      this.props.add(person);
    }
  };

  updatePerson = async person => {
    const newPerson = await this.props.update(person);
    this.updateLanguageIfNecessary(newPerson);
    return newPerson;
  };

  updateLanguageIfNecessary(newPerson) {
    if (newPerson && newPerson.isUser) {
      this.props.updateLanguage(newPerson.ui_language);
    }
  }

  render() {
    const selectedPerson = this.props.selected;
    return (
      <div className={styles.container}>
        <div className={styles.master}>
          <PeopleTable
            t={this.props.t}
            id={this.props.id}
            people={this.props.people}
            can={this.props.can}
          />
        </div>
        <div className={styles.detail}>
          {this.props.action == "new" && (
            <NewPersonForm
              t={this.props.t}
              saving={this.props.savingNew}
              addPerson={this.addPerson}
              duplicatePerson={this.state.duplicatePerson}
            />
          )}
          {this.props.action == "show" &&
            selectedPerson &&
            (selectedPerson.loaded ? (
              <PersonPage
                key={selectedPerson.id}
                person={selectedPerson}
                t={this.props.t}
                updatePerson={this.updatePerson}
                deletePerson={this.props.delete}
              />
            ) : (
              <Loading t={this.props.t} />
            ))}
          {!this.props.action && (
            <span>Placeholder for PeopleBoard summary</span>
          )}
        </div>
      </div>
    );
  }
}

const PeopleBoard = thingBoard(Board, {
  name: "person",
  pluralName: "people",
  compare: personCompare
});

export default PeopleBoard;
