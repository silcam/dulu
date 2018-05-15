function fixCaps(text) {
    if (text == text.toLowerCase() || text == text.toUpperCase()) {
        return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
    }
    return text
}

export default fixCaps