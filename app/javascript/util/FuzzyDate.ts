export interface IFuzzyDate {
  year: number;
  month?: number;
  day?: number;
}

export default class FuzzyDate {
  static today() {
    return stdDateString(new Date());
  }

  static compareStr(a: string, b: string) {
    return FuzzyDate.compare(toObject(a), toObject(b));
  }

  static compare(a: IFuzzyDate, b: IFuzzyDate) {
    if (a.year != b.year) return a.year - b.year;
    if (!a.month || !b.month) return 0;
    if (a.month != b.month) return a.month - b.month;
    if (!a.day || !b.day) return 0;
    return a.day - b.day;
  }

  static toObject(date: string) {
    return toObject(date);
  }

  static toString(date: IFuzzyDate) {
    return toString(date);
  }
}

// function toObjectIfNeeded(date: string | IFuzzyDate) {
//   if (typeof date == 'string') return date;
//   return toObject(date as string);
// }

function toObject(date: string) {
  let dateObj: IFuzzyDate = {
    year: parseInt(date.slice(0, 4))
  };
  if (date.length > 4) dateObj.month = parseInt(date.slice(5, 7));
  if (date.length > 7) dateObj.day = parseInt(date.slice(8, 10));
  return dateObj;
}

function toString(date: IFuzzyDate) {
  let s = `${date.year}`;
  if (date.month) s += "-" + zeroPadHack(date.month);
  if (date.day) s += "-" + zeroPadHack(date.day);
  return s;
}

// Srsly?? Come on, javascript...
// YYYY-MM-DD
function stdDateString(date: Date) {
  return (
    date.getFullYear() +
    "-" +
    zeroPadHack(date.getMonth() + 1) +
    "-" +
    zeroPadHack(date.getDate())
  );
}

function zeroPadHack(num: number) {
  return ("0" + num).slice(-2);
}
