function selectOptionsFromObject(object: { [key: string]: string }) {
  return Object.keys(object).map(key => {
    return {
      value: key,
      display: object[key]
    };
  });
}

export default selectOptionsFromObject;
