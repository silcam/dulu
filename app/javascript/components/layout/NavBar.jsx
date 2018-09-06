import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./navBarStyles";

export default function NavBar(props) {
  return (
    <nav style={styles.nav}>
      <ul>
        <li style={styles.li}>
          <NavLink to="/" style={styles.a}>
            Home
          </NavLink>
        </li>
        <li style={styles.li}>
          <NavLink to="/people" style={styles.a}>
            People
          </NavLink>
        </li>
        <li style={styles.li}>
          <NavLink to="/organizations" style={styles.a}>
            Organizations
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
