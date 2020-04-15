import { ILanguage } from "../models/Language";

export const ADD_LANGUAGES = "ADD_LANGUAGES";

export interface LanguageAction {
  type: string;
  language?: ILanguage;
  languages?: ILanguage[];
}

export function addLanguages(languages: ILanguage[]) {
  return {
    type: ADD_LANGUAGES,
    languages: languages
  };
}
