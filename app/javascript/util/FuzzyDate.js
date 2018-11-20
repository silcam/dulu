export default class FuzzyDate {
  static today() {
    return stdDateString(new Date());
  }
}

// Srsly?? Come on, javascript...
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
