import {
  SET_LANGUAGES,
  SET_LANGUAGE,
  ADD_LANGUAGES
} from "../actions/languageActions";
import { setList, setItem, addItems } from "./reducerUtil";
import { languageCompare } from "../models/language";

const emptyState = {
  list: [],
  byId: {}
};

export default function languagesReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_LANGUAGES:
      return setList(state, action.languages);
    case ADD_LANGUAGES:
      return addItems(state, action.languages, languageCompare);
    case SET_LANGUAGE:
      return setItem(state, action.language, languageCompare);
  }
  return state;
}
