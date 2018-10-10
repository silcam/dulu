import React from "react";
import { NavLink, Link } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./NavBar.css";
import DuluAxios from "../../util/DuluAxios";

export default function NavBar(props) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink exact to="/">
            {props.t("Home")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/people">{props.t("People")}</NavLink>
        </li>
        <li>
          <NavLink to="/organizations">{props.t("Organizations")}</NavLink>
        </li>
      </ul>
      {props.user && (
        <ul className={styles.ulRight}>
          <li>
            <Link to={pathToUser(props.user)}>{props.user.first_name}</Link>
          </li>
          <li>
            <a
              onClick={async e => {
                e.preventDefault();
                await DuluAxios.post("/logout", {});
                document.location = "/";
              }}
              href="/logout"
            >
              {props.t("Logout")}
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}

NavBar.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func.isRequired
};

function pathToUser(user) {
  return `/people/show/${user.id}`;
}
