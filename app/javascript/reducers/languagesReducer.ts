import {
  SET_LANGUAGES,
  SET_LANGUAGE,
  ADD_LANGUAGES,
  LanguageAction
} from "../actions/languageActions";
import Language from "../models/Language";

export default function languagesReducer(
  state = Language.emptyList(),
  action: LanguageAction
) {
  switch (action.type) {
    case SET_LANGUAGES:
      return state.addAndPrune(action.languages!);
    case ADD_LANGUAGES:
      return state.add(action.languages!);
    case SET_LANGUAGE:
      return state.add([action.language!]);
  }
  return state;
}
