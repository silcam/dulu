import en from "./en.js";
import fr from "./fr.js";

// This is totally naive, fyi

const strings = {
  en: en,
  fr: fr
};

// const I18n = {
//   locale: "en",

//   setLocale: function(newLocale) {
//     if (strings[newLocale]) this.locale = newLocale;
//   },

//   t: function(key, subs) {
//     return translate(key, subs, this.locale);
//   }
// };

export default function translator(setLocale) {
  setLocale = strings[setLocale] ? setLocale : "en";
  let exportedT = (key, subs, locale) => {
    let tLocale = locale && strings[locale] ? locale : setLocale;
    return t(key, subs, tLocale);
  };
  exportedT.locale = setLocale;
  return exportedT;
}

function t(key, subs, locale) {
  let tStr = getString(strings[locale], key);
  if (tStr === undefined) {
    if (locale != "en")
      console.error(`Missing translation key: ${key} for locale: ${locale}`);
    return spaceAndCapitalize(key);
  }
  return subs ? tSubs(tStr, subs) : tStr;
}

function spaceAndCapitalize(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_(\w)/g, (match, letter) => ` ${letter.toUpperCase()}`);
}

function getString(strings, key) {
  try {
    return key.split(".").reduce((stringsAccum, k) => {
      return stringsAccum[k];
    }, strings);
  } catch (error) {
    return undefined; // Key not found
  }
}

function tSubs(str, subs) {
  return Object.keys(subs).reduce((accumStr, subKey) => {
    const pattern = new RegExp("%{" + subKey + "}", "g");
    return accumStr.replace(pattern, subs[subKey]);
  }, str);
}

// export default I18n;
