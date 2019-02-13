export const SET_LANGUAGES = "SET_LANGUAGES";
export const SET_LANGUAGE = "SET_LANGUAGE";
export const ADD_LANGUAGES = "ADD_LANGUAGES";

export function setLanguages(languages) {
  return {
    type: SET_LANGUAGES,
    languages: languages
  };
}

export function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    language: language
  };
}

export function addLanguages(languages) {
  return {
    type: ADD_LANGUAGES,
    languages: languages
  };
}
