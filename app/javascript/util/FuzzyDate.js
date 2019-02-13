export default class FuzzyDate {
  static today() {
    return stdDateString(new Date());
  }

  static compare(a, b) {
    a = a.year ? a : toObject(a);
    b = b.year ? b : toObject(b);
    if (a.year != b.year) return a.year - b.year;
    if (!a.month || !b.month) return 0;
    if (a.month != b.month) return a.month - b.month;
    if (!a.day || !b.day) return 0;
    return a.day - b.day;
  }

  static toObject(date) {
    return toObject(date);
  }

  static toString(date) {
    return toString(date);
  }
}

function toObject(date) {
  let dateObj = {
    year: parseInt(date.slice(0, 4))
  };
  if (date.length > 4) dateObj.month = parseInt(date.slice(5, 7));
  if (date.length > 7) dateObj.day = parseInt(date.slice(8, 10));
  return dateObj;
}

function toString(date) {
  let s = `${date.year}`;
  if (date.month) s += "-" + zeroPadHack(date.month);
  if (date.day) s += "-" + zeroPadHack(date.day);
  return s;
}

// Srsly?? Come on, javascript...
// YYYY-MM-DD
function stdDateString(date) {
  return (
    date.getFullYear() +
    "-" +
    zeroPadHack(date.getMonth() + 1) +
    "-" +
    zeroPadHack(date.getDate())
  );
}

function zeroPadHack(num) {
  return ("0" + num).slice(-2);
}
