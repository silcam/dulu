import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./NavBar.css";

export default function NavBar(props) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/people">People</NavLink>
        </li>
        <li>
          <NavLink to="/organizations">Organizations</NavLink>
        </li>
      </ul>
    </nav>
  );
}
