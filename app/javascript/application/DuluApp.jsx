import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";

export default class DuluApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.state.session)
      return (
        <Login
          login={() => {
            this.setState({
              session: {
                user: {
                  id: 1,
                  first_name: "Rick",
                  last_name: "Conrad"
                }
              }
            });
          }}
        />
      );
    return (
      <div>
        <ul>
          <li>
            <NavLink to="/people">People</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </ul>

        <Switch>
          <Route path="/people" component={People} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    );
  }
}

function People() {
  return <h1>Da Peeeps Page</h1>;
}

function Dashboard() {
  return <h1>Da Dashboard</h1>;
}

function Login(props) {
  return (
    <div>
      <a href="http://localhost:3000/login">Log in</a>
    </div>
  );
}
