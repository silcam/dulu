import React, { useContext } from "react";
import { IPerson, EmailPref } from "../../models/Person";
import I18nContext from "../../contexts/I18nContext";
import SelectInput from "../shared/SelectInput";
import { Locale } from "../../i18n/i18n";
import MyNotificationChannelsContainer from "./MyNotificationChannelsContainer";

interface IProps {
  person: IPerson;
  updatePersonAndSave: (p: Partial<IPerson>) => void;
}

export default function DuluSettings(props: IProps) {
  const t = useContext(I18nContext);
  const person = props.person;

  return (
    <div>
      <h3>{t("DuluSettings")}</h3>
      <table>
        <tbody>
          <tr>
            <th>{t("dulu_preferred_language")}</th>
            <td>
              <SelectInput
                value={person.ui_language}
                options={[
                  { value: "en", display: "English" },
                  { value: "fr", display: "Français" }
                ]}
                setValue={value =>
                  props.updatePersonAndSave({ ui_language: value as Locale })
                }
              />
            </td>
          </tr>
          <tr>
            <th>{t("Email_frequency")}</th>
            <td>
              <SelectInput
                value={person.email_pref}
                options={SelectInput.translatedOptions(
                  Object.keys(t("email_prefs")),
                  t,
                  "email_prefs"
                )}
                setValue={value =>
                  props.updatePersonAndSave({ email_pref: value as EmailPref })
                }
              />
            </td>
          </tr>
          <MyNotificationChannelsContainer
            person={person}
            updatePersonAndSave={props.updatePersonAndSave}
          />
        </tbody>
      </table>
    </div>
  );
}
