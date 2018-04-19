/**
 * Converts date string into format like 1 Jul 2018
 * @param {String} date in the format YYYY-MM-DD or YYYY-MM or YYYY
 * @param {Array} monthNames Translated month names/abbreviations
 */
function dateString(date, monthNames) {
    if (date.length == 4) return date

    let year = date.slice(0, 4)
    let monthIndex = parseInt(date.slice(5, 7)) - 1
    let month = monthNames[monthIndex]
    if (date.length == 7) return `${month} ${year}`

    let day = date.slice(8, 10)
    if (day.charAt(0) == '0') day = day.slice(1, 2)
    return `${day} ${month} ${year}`
}

export default dateString