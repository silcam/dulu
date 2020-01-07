import React, { useContext } from "react";
import TextOrEditText from "../shared/TextOrEditText";
import TextOrYesNo from "../shared/TextOrYesNo";
import TextOrInput from "../shared/TextOrInput";
import { CountrySearchTextInput } from "../shared/SearchTextInput";
import I18nContext from "../../contexts/I18nContext";
import { IPerson } from "../../models/Person";

interface IProps {
  person: IPerson;
  editing?: boolean;
  updatePerson: (person: Partial<IPerson>) => void;
}

function PersonBasicInfo(props: IProps) {
  const t = useContext(I18nContext);
  const person = props.person;
  const home_country = person.home_country || { id: null, name: "" };

  return (
    <table className="table">
      <tbody>
        <tr>
          <th>{t("Home_country")}</th>
          <td>
            <TextOrInput editing={props.editing} text={home_country.name}>
              <CountrySearchTextInput
                text={home_country.name}
                updateValue={country =>
                  props.updatePerson(
                    country
                      ? {
                          home_country: country,
                          country_id: country.id
                        }
                      : {
                          home_country: { name: "", id: null },
                          country_id: null
                        }
                  )
                }
                allowBlank
              />
            </TextOrInput>
          </td>
        </tr>
        <tr>
          <th>{t("Email")}</th>
          <td>
            <TextOrEditText
              editing={props.editing}
              value={person.email}
              setValue={value => props.updatePerson({ email: value })}
              validateNotBlank={person.has_login}
              showError
            />
          </td>
        </tr>
        {!person.isUser && (!props.editing || person.can.grant_login) && (
          <tr>
            <th>{t("Dulu_account")}</th>
            <td>
              <TextOrYesNo
                editing={props.editing}
                value={person.has_login}
                setValue={value => props.updatePerson({ has_login: value })}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default PersonBasicInfo;
