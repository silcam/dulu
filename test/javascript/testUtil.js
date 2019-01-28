export function monthNames() {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
}

export function postponeFailure(date) {
  expect(new Date().valueOf()).toBeLessThan(date.valueOf());
}
