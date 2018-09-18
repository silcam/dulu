import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./NavBar.css";

export default function NavBar(props) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink exact to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/people">People</NavLink>
        </li>
        <li>
          <NavLink to="/organizations">Organizations</NavLink>
        </li>
      </ul>
      {props.user && (
        <ul className={styles.ulRight}>
          <li>
            <NavLink to={pathToUser(props.user)}>
              {props.user.first_name}
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}

function pathToUser(user) {
  return `/people/${user.id}`;
}
