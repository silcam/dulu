import axios from "axios";
import React from "react";
import styles from "../shared/MasterDetail.css";
import { Switch, Route } from "react-router-dom";
import PersonContent from "./PersonContent";
import PeopleTable from "./PeopleTable";
import NewPersonForm from "./NewPersonForm";

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
  constructor(props) {
    super(props);
    let selection = null;
    if (props.personId) {
      selection = {
        type: "Person",
        id: props.personId
      };
    } else if (props.orgId) {
      selection = {
        type: "Org",
        id: props.orgId
      };
    }
    this.state = {
      selection: selection,
      people: [],
      orgs: [],
      peopleCan: {},
      orgCan: {}
    };
  }

  componentDidMount() {
    axios
      .get("/api/people")
      .then(response => {
        this.setState({
          people: response.data.people,
          peopleCan: response.data.can
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  setSelection = selection => {
    this.setState({
      selection: selection
    });
  };

  setPerson = id => {
    this.setSelection({
      type: "Person",
      id: id
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
    return (
      <div className={styles.container}>
        <div className={styles.master}>
          <Route
            path="/people/:action?"
            render={({ match }) => (
              <PeopleTable
                t={this.props.t}
                routeAction={match.params.action}
                people={this.state.people}
                setPerson={this.setPerson}
                can={this.state.peopleCan}
              />
            )}
          />
        </div>
        <div className={styles.detail}>
          <Switch>
            <Route
              path="/people/new"
              render={() => (
                <NewPersonForm
                  t={this.props.t}
                  authToken={this.props.authToken}
                  addPerson={this.addPerson}
                />
              )}
            />
            <Route
              path="/people/:id"
              render={({ match }) => (
                <PersonContent
                  id={match.params.id}
                  t={this.props.t}
                  setSelection={this.setSelection}
                  deletePerson={this.deletePerson}
                  authToken={this.props.authToken}
                />
              )}
            />

            <Route
              render={() => <span>Placeholder for PeopleBoard summary</span>}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default PeopleBoard;
