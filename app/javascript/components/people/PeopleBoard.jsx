import React from "react";
import styles from "../shared/MasterDetail.css";
import PeopleTable from "./PeopleTable";
import NewPersonForm from "./NewPersonForm";
import PersonPage from "./PersonPage";
import Loading from "../shared/Loading";
import { personCompare, sameName } from "../../models/person";
import thingBoard from "../shared/thingBoard";
import AddIcon from "../shared/icons/AddIcon";
import { Link } from "react-router-dom";
import TextFilter from "../shared/TextFilter";
import FlexSpacer from "../shared/FlexSpacer";

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

  replacePerson = async person => {
    this.props.replace(person);
    this.updateLanguageIfNecessary(person);
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
        <div className={styles.headerBar}>
          <h2>
            <Link to="/people">{this.props.t("People")}</Link>
          </h2>
          <TextFilter
            placeholder={this.props.t("Find")}
            updateFilter={filter => this.setState({ filter: filter })}
          />
          {this.props.can.create && (
            <Link to="/people/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
          <FlexSpacer />
          <h3>
            <Link to="/organizations">{this.props.t("Organizations")}</Link>
          </h3>
        </div>
        <div className={styles.masterDetailContainer}>
          <div className={styles.master}>
            <PeopleTable
              t={this.props.t}
              id={this.props.id}
              people={this.props.people}
              can={this.props.can}
              filter={this.state.filter}
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
                  replacePerson={this.replacePerson}
                  deletePerson={this.props.delete}
                  setNetworkError={this.props.setNetworkError}
                />
              ) : (
                <Loading t={this.props.t} />
              ))}
            {!this.props.action && (
              <span>Placeholder for PeopleBoard summary</span>
            )}
          </div>
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
