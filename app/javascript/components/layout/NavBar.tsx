import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.css";
import DuluAxios from "../../util/DuluAxios";
import { User } from "../../application/DuluApp";
import I18nContext from "../../application/I18nContext";

interface IProps {
  user: User;
}

export default function NavBar(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to="/" className={styles.duluLink}>
            <img src={require("./dulu.png")} alt="Dulu" />
          </Link>
        </li>
        <li>
          <Link to="/languages">{t("Languages")}</Link>
        </li>
        <li>
          <Link to="/people">{t("People")}</Link>
        </li>
        <li>
          <Link to="/events">{t("Events")}</Link>
        </li>
        <li>
          <Link to="/reports">{t("Reports")}</Link>
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
                document.location.href = "/";
              }}
              href="/logout"
            >
              {t("Logout")}
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}

function pathToUser(user: User) {
  return `/people/show/${user.id}`;
}
