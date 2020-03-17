import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.css";
import DuluAxios from "../../util/DuluAxios";
import NavLoadingIndicator from "./NavLoadingIndicator";
import useAppSelector from "../../reducers/useAppSelector";
import useTranslation from "../../i18n/useTranslation";
import { User } from "../../reducers/currentUserReducer";

export default function NavBar() {
  const t = useTranslation();
  const user = useAppSelector(state => state.currentUser);
  const loading = useAppSelector(state => state.network.loadingCount) > 0;

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
      {user.id && (
        <ul className={styles.ulRight}>
          <li>
            <Link to={pathToUser(user)}>{user.first_name}</Link>
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
      <NavLoadingIndicator loading={loading} />
    </nav>
  );
}

function pathToUser(user: User) {
  return `/people/show/${user.id}`;
}
