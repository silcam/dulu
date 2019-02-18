import {
  SET_LANGUAGES,
  SET_LANGUAGE,
  ADD_LANGUAGES,
  LanguageAction
} from "../actions/languageActions";
import { ILanguage } from "../models/Language";
import { stdReducers } from "./stdReducers";
import Language from "../models/Language";

export interface LanguageState {
  list: number[];
  byId: { [id: string]: ILanguage | undefined };
}

const emptyState: LanguageState = {
  list: [],
  byId: {}
};

const stdLanguageReducers = stdReducers<ILanguage>(
  Language.emptyLanguage,
  Language.compare
);

export default function languagesReducer(
  state = emptyState,
  action: LanguageAction
) {
  switch (action.type) {
    case SET_LANGUAGES:
      return stdLanguageReducers.setList(state, action.languages!);
    case ADD_LANGUAGES:
      return stdLanguageReducers.addItems(state, action.languages!);
    case SET_LANGUAGE:
      return stdLanguageReducers.addItems(state, [action.language!]);
  }
  return state;
}
