import { ADD_PEOPLE, PeopleAction } from "../actions/peopleActions";
import { personCompare, IPerson } from "../models/Person";
import List from "../models/List";
import { Locale } from "../i18n/i18n";
import { LoadAction, isLoadAction } from "./LoadAction";

export const emptyPerson: IPerson = {
  id: 0,
  first_name: "",
  last_name: "",
  can: {},
  roles: [],
  email: "",
  ui_language: Locale.en,
  email_pref: "daily",
  notification_channels: "",
  grantable_roles: [],
  gender: "M"
};

export default function peopleReducer(
  state = new List<IPerson>(emptyPerson, [], personCompare),
  action: PeopleAction | LoadAction
) {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.people)
      .remove(action.payload.deletedPeople);
  }
  switch (action.type) {
    case ADD_PEOPLE:
      return state.add(action.people!);
  }
  return state;
}
