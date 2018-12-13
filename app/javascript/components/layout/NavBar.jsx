import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./NavBar.css";
import DuluAxios from "../../util/DuluAxios";

export default function NavBar(props) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to="/" className={styles.duluLink}>
            <img
              src={require("./dulu.png")}
              alt="Dulu"
              width="107"
              height="40"
            />
          </Link>
        </li>
        <li>
          <Link to="/languages">{props.t("Languages")}</Link>
        </li>
        <li>
          <Link to="/people">{props.t("People")}</Link>
        </li>
        <li>
          <Link to="/events">{props.t("Events")}</Link>
        </li>
        <li>
          <Link to="/reports">{props.t("Reports")}</Link>
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
