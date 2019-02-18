function dateString(date: string, monthNames: string[]) {
  if (!date) return "";

  if (date.length == 4) return date;

  let year = date.slice(0, 4);
  let monthIndex = parseInt(date.slice(5, 7)) - 1;
  let month = monthNames[monthIndex];
  if (date.length == 7) return `${month} ${year}`;

  let day = date.slice(8, 10);
  if (day.charAt(0) == "0") day = day.slice(1, 2);
  return `${day} ${month} ${year}`;
}

export default dateString;
