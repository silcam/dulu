// Default imports. webpack 5 exposes only the default export of a JSON module and rejects
// anything else -- both the original `import { en } from "...json"` and a namespace import
// whose properties are then read fail with "Should not import the named export ... from
// default-exporting module". webpack 4 allowed the named form.
//
// Under Jest this needs `esModuleInterop`, which is set in tsconfig.test.json rather than
// tsconfig.json: ts-jest emits CommonJS, where a plain JSON require has no `default`
// property, so without the interop helper these are `undefined`. The webpack build emits
// ESM and needs no such help, so the flag is scoped to the test compile.
import frLocale from "../../../config/locales/fr.json";
import enLocale from "../../../config/locales/en.json";

const fr = frLocale.fr;
const en = enLocale.en;

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
  const exportedT = <T>function(key: string, subs: Subs, locale: Locale) {
    const tLocale = locale && strings[locale] ? locale : setLocale;
    return t(key, subs, tLocale);
  };
  exportedT.locale = setLocale;
  return exportedT;
}

function t(key: string, subs: Subs, locale: Locale) {
  if (!key) return "";
  const tStr = getString(strings[locale], key);
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
  } catch {
    return undefined; // Key not found
  }
}

function tSubs(str: string, subs: Subs) {
  return Object.keys(subs).reduce((accumStr, subKey) => {
    const pattern = new RegExp("%{" + subKey + "}", "g");
    return accumStr.replace(pattern, subs[subKey]);
  }, str);
}
