import { ADD_LANGUAGES, LanguageAction } from "../actions/languageActions";
import Language from "../models/Language";
import { LoadAction, isLoadAction } from "./LoadAction";

export default function languagesReducer(
  state = Language.emptyList(),
  action: LanguageAction | LoadAction
) {
  if (isLoadAction(action)) {
    return state.add(action.payload.languages);
  }
  switch (action.type) {
    case ADD_LANGUAGES:
      return state.add(action.languages!);
  }
  return state;
}
