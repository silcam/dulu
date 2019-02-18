import dateString from "./dateString";

function eventDateString(
  startDate: string,
  endDate: string,
  monthNames: string[]
) {
  let text = dateString(startDate, monthNames);
  if (startDate != endDate) {
    text += ` - ${dateString(endDate, monthNames)}`;
  }
  return text;
}

export default eventDateString;
