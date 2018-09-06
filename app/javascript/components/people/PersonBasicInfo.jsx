import React from "react";

import selectOptionsFromObject from "../../util/selectOptionsFromObject";

import EditableTextBox from "../shared/EditableTextBox";
import EditableTextSearchInput from "../shared/EditableTextSearchInput";
import EditableTextSelect from "../shared/EditableTextSelect";
import EditableTextYesNo from "../shared/EditableTextYesNo";

import EditableTextUiLanguage from "./EditableTextUiLanguage";

function PersonBasicInfo(props) {
  const t = props.t;
  const person = props.person;
  const homeCountry = person.home_country || { id: null, name: "" };
  const hasLoginText = person.has_login ? t("Yes") : t("No");
  const emailPrefOptions = selectOptionsFromObject(t("email_prefs"));

  const updateUiLang = (field, value) => {
    props.updateField(field, value, () => {
      window.location.href = `/people/${person.id}`;
    });
  };

  const updateLogin = (field, value) => {
    if (value && !props.person.email) {
      props.setErrorMessage(props.t("need_email_for_login"));
    } else {
      props.updateField(field, value);
    }
  };

  const updateEmail = (field, value) => {
    if (value) props.setErrorMessage("");
    props.updateField(field, value);
  };

  return (
    <table className="table">
      <tbody>
        <tr>
          <th>{t("Home_country")}</th>
          <td>
            <EditableTextSearchInput
              queryPath="/api/countries/search"
              text={homeCountry.name}
              value={homeCountry.id}
              field={"country_id"}
              editEnabled={props.editEnabled}
              updateValue={props.updateField}
            />
          </td>
        </tr>
        <tr>
          <th>{t("Email")}</th>
          <td>
            <EditableTextBox
              field={"email"}
              text={person.email}
              value={person.email}
              updateValue={updateEmail}
              editEnabled={props.editEnabled}
            />
          </td>
        </tr>
        {!person.isUser && (
          <tr>
            <th>{t("Dulu_account")}</th>
            <td>
              <EditableTextYesNo
                text={hasLoginText}
                value={person.has_login}
                field="has_login"
                updateValue={updateLogin}
                editEnabled={props.editEnabled}
                t={t}
              />
            </td>
          </tr>
        )}
        {person.isUser && (
          <React.Fragment>
            <tr>
              <th>{t("dulu_preferred_language")}</th>
              <td>
                <EditableTextUiLanguage
                  text={t(`languages.${person.ui_language}`)}
                  value={person.ui_language}
                  field="ui_language"
                  updateValue={updateUiLang}
                  editEnabled={props.editEnabled}
                  t={t}
                />
              </td>
            </tr>
            <tr>
              <th>{t("Email_frequency")}</th>
              <td>
                <EditableTextSelect
                  text={t(`email_prefs.${person.email_pref}`)}
                  value={person.email_pref}
                  field={"email_pref"}
                  updateValue={props.updateField}
                  editEnabled={props.editEnabled}
                  options={emailPrefOptions}
                />
              </td>
            </tr>
          </React.Fragment>
        )}
      </tbody>
    </table>
  );
}

export default PersonBasicInfo;
