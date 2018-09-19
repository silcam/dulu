import axios from "axios";
import React from "react";
import styles from "../shared/MasterDetail.css";
import { Switch, Route } from "react-router-dom";
import PersonContent from "./PersonContent";
import PeopleTable from "./PeopleTable";
import NewPersonForm from "./NewPersonForm";
import PersonPage from "./PersonPage";
import update from "immutability-helper";
import { findById, findIndexById } from "../../util/findById";

function findSpotForPerson(person, people) {
  let index = 0;
  while (
    index < people.length &&
    person.last_name.localeCompare(people[index].last_name) > 0
  ) {
    ++index;
  }
  return index;
}

class PeopleBoard extends React.PureComponent {
  state = {
    people: [],
    can: {}
  };

  async componentDidMount() {
    const response = await axios.get("/api/people");
    if (response.data.people)
      this.setState({
        people: response.data.people,
        can: response.data.can
      });
    this.fetchPersonIfNeeded();
  }

  async componentDidUpdate() {
    this.fetchPersonIfNeeded();
  }

  fetchPersonIfNeeded = () => {
    if (this.props.id) {
      let person = findById(this.state.people, this.props.id);
      if (person && !person.loaded) this.fetchPerson(this.props.id);
    }
  };

  fetchPerson = async id => {
    const response = await axios.get(`/api/people/${id}`);
    if (response.data.person)
      this.setState(prevState => {
        const personIndex = prevState.people.findIndex(p => p.id == id);
        const people = update(prevState.people, {
          [personIndex]: { $merge: response.data.person }
        });
        return { people: people };
      });
  };

  addPerson = person => {
    const selection = {
      type: "Person",
      id: person.id
    };
    this.setState(prevState => {
      let index = findSpotForPerson(person, prevState.people);
      let people = prevState.people.slice(0, index);
      people.push(person);
      people = people.concat(prevState.people.slice(index));
      return {
        people: people,
        selection: selection
      };
    });
  };

  updatePerson = async person => {
    const response = await axios.put(`/api/people/${person.id}`, {
      authenticity_token: this.props.authToken,
      person: person
    });
    const newPerson = response.data.person;
    this.updateLanguageIfNecessary(newPerson);
    this.setState(prevState => ({
      people: update(prevState.people, {
        [findIndexById(prevState.people, newPerson.id)]: { $set: newPerson }
      })
    }));
    return newPerson;
  };

  updateLanguageIfNecessary(newPerson) {
    if (newPerson.isUser) {
      const oldPerson = findById(this.state.people, newPerson.id);
      if (newPerson.ui_language != oldPerson.ui_language)
        this.props.updateLanguage(newPerson.ui_language);
    }
  }

  deletePerson = id => {
    this.setState(prevState => {
      const people = prevState.people;
      let index = people.findIndex(p => {
        return p.id == id;
      });
      let newPeople = people.slice(0, index).concat(people.slice(index + 1));
      return {
        people: newPeople,
        selection: null
      };
    });
  };

  render() {
    const selectedPerson =
      this.props.id && findById(this.state.people, this.props.id);
    return (
      <div className={styles.container}>
        <div className={styles.master}>
          <PeopleTable
            t={this.props.t}
            id={this.props.id}
            people={this.state.people}
            can={this.state.can}
          />
        </div>
        <div className={styles.detail}>
          {this.props.action == "new" && (
            <NewPersonForm
              t={this.props.t}
              authToken={this.props.authToken}
              addPerson={this.addPerson}
            />
          )}
          {this.props.action == "show" &&
            selectedPerson &&
            selectedPerson.loaded && (
              <PersonPage
                key={selectedPerson.id}
                person={selectedPerson}
                t={this.props.t}
                updatePerson={this.updatePerson}
                deletePerson={this.deletePerson}
              />
            )}
          {!this.props.action && (
            <span>Placeholder for PeopleBoard summary</span>
          )}
        </div>
      </div>
    );
  }
}

export default PeopleBoard;
