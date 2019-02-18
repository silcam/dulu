import { ILanguage } from "../models/Language";

export const SET_LANGUAGES = "SET_LANGUAGES";
export const SET_LANGUAGE = "SET_LANGUAGE";
export const ADD_LANGUAGES = "ADD_LANGUAGES";

export interface LanguageAction {
  type: string;
  language?: ILanguage;
  languages?: ILanguage[];
}

export function setLanguages(languages: ILanguage[]) {
  return {
    type: SET_LANGUAGES,
    languages: languages
  };
}

export function setLanguage(language: ILanguage) {
  return {
    type: SET_LANGUAGE,
    language: language
  };
}

export function addLanguages(languages: ILanguage[]) {
  return {
    type: ADD_LANGUAGES,
    languages: languages
  };
}
