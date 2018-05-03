function selectOptionsFromObject(object) {
    return Object.keys(object).map((key) => {
        return {
            value: key,
            display: object[key]
        }
    })
}

export default selectOptionsFromObject