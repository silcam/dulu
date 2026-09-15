function dateString(date: string | undefined, monthNames: string[]) {
  if (!date) return "";

  if (date.length == 4) return date;

  const year = date.slice(0, 4);
  const monthIndex = parseInt(date.slice(5, 7)) - 1;
  const month = monthNames[monthIndex];
  if (date.length == 7) return `${month} ${year}`;

  let day = date.slice(8, 10);
  if (day.charAt(0) == "0") day = day.slice(1, 2);
  return `${day} ${month} ${year}`;
}

export default dateString;
