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

// The locale files are a tree, not a flat table, and `t` is a walk over it: most keys
// land on a string, but `month_names_short` lands on a string[] and `roles`/`genders`/
// `domains`/`languages` land on an object that SelectInput turns into <option>s. That is
// why the return used to be `any`.
//
// `R` defaults to string, so all ~360 string call sites are unchanged, and the handful
// that want something else either infer it from the parameter they feed (SelectInput's
// options) or name it (`t<string[]>("month_names_short")`). The cast that makes this true
// lives in `translator` below -- one place, rather than one per caller.
export interface T {
  <R = string>(key: string, subs?: Subs, locale?: Locale): R;
  locale?: Locale;
}

// The weaker contract: a key in, a string out. Prefer this over `T` in anything that only
// looks up strings -- a generic signature is cheap to call and expensive to supply, so
// asking for `T` forces every caller to hand over a full tree-walker. `T` satisfies this
// (a generic instantiates to meet a concrete signature), and so does a stub that does not
// translate at all, which is what Activity.compare needs: it sorts inside the reducer,
// where there is no locale to translate with.
export type Translate = (key: string, subs?: Subs) => string;

export enum Locale {
  en = "en",
  fr = "fr"
}

interface Subs {
  [key: string]: string;
}

// The shape of the locale JSON: strings at the leaves, arrays for the month names, and
// objects everywhere in between.
type LocaleNode = string | string[] | LocaleStrings;
interface LocaleStrings {
  [key: string]: LocaleNode;
}

export default function translator(setLocale: Locale) {
  setLocale = strings[setLocale] ? setLocale : Locale.en;
  // The one cast in the file, and the only place the untyped JSON walk meets the typed
  // API. `t` returns whatever node the key landed on; `T` promises the caller's `R`.
  // Nothing can check that the key and the expected type agree -- that is a fact about the
  // locale files, not about this code -- so the assertion is made here once instead of at
  // every call site.
  const exportedT = function(key: string, subs?: Subs, locale?: Locale) {
    const tLocale = locale && strings[locale] ? locale : setLocale;
    return t(key, subs, tLocale);
  } as T;
  exportedT.locale = setLocale;
  return exportedT;
}

function t(key: string, subs: Subs | undefined, locale: Locale): LocaleNode {
  if (!key) return "";
  const tStr = getString(strings[locale] as LocaleStrings, key);
  if (tStr === undefined) {
    if (locale != "en")
      console.error(`Missing translation key: ${key} for locale: ${locale}`);
    return spaceAndCapitalize(key);
  }
  // Substitution only means anything on a leaf; a key that lands on an array or an object
  // has no `%{...}` in it to replace.
  return subs && typeof tStr == "string" ? tSubs(tStr, subs) : tStr;
}

function spaceAndCapitalize(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_(\w)/g, (_match, letter) => ` ${letter.toUpperCase()}`);
}

function getString(
  strings: LocaleStrings,
  key: string
): LocaleNode | undefined {
  try {
    return key.split(".").reduce<LocaleNode>((stringsAccum, k) => {
      return (stringsAccum as LocaleStrings)[k];
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
