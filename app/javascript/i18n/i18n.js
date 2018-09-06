import en from "./en.js";
import fr from "./fr.js";

// This is totally naive, fyi

const strings = {
  en: en,
  fr: fr
};

export default function translator(locale) {
  const tLocale = strings[locale] ? locale : "en";
  return (key, subs) => {
    let tStr = getString(strings[tLocale], key);
    if (tStr === undefined) tStr = key;
    return tStr;
  };
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

// export default {
//   locale: "en",
//   t: (key, subs) => {
//     let tStr = strings[this.locale][key];
//     if (tStr === undefined) tStr = strings.en[key];
//     return subs
//       ? Object.keys(subs).reduce((str, sub) => {
//           const pattern = new RegExp("%{" + sub + "}", "g");
//           return str.replace(pattern, subs[sub]);
//         }, tStr)
//       : tStr;
//   }
// };
