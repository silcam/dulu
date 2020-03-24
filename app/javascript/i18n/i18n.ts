import { fr } from "../../../config/locales/fr.json";
import { en } from "../../../config/locales/en.json";

// This is totally naive, fyi

const strings = {
  en: en,
  fr: fr
};

export interface T {
  (key: string, subs?: any, locale?: string): any;
  locale?: Locale;
}

export enum Locale {
  en = "en",
  fr = "fr"
}

interface Subs {
  [key: string]: string;
}

export default function translator(setLocale: Locale) {
  setLocale = strings[setLocale] ? setLocale : Locale.en;
  let exportedT = <T>function(key: string, subs: Subs, locale: Locale) {
    let tLocale = locale && strings[locale] ? locale : setLocale;
    return t(key, subs, tLocale);
  };
  exportedT.locale = setLocale;
  return exportedT;
}

function t(key: string, subs: Subs, locale: Locale) {
  if (!key) return "";
  let tStr = getString(strings[locale], key);
  if (tStr === undefined) {
    if (locale != "en")
      console.error(`Missing translation key: ${key} for locale: ${locale}`);
    return spaceAndCapitalize(key);
  }
  return subs ? tSubs(tStr, subs) : tStr;
}

function spaceAndCapitalize(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_(\w)/g, (_match, letter) => ` ${letter.toUpperCase()}`);
}

function getString(strings: any, key: string) {
  try {
    return key.split(".").reduce((stringsAccum, k) => {
      return stringsAccum[k];
    }, strings);
  } catch (error) {
    return undefined; // Key not found
  }
}

function tSubs(str: string, subs: Subs) {
  return Object.keys(subs).reduce((accumStr, subKey) => {
    const pattern = new RegExp("%{" + subKey + "}", "g");
    return accumStr.replace(pattern, subs[subKey]);
  }, str);
}
