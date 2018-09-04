function tSub(text, subs) {
  let newText = text;
  for (let subKey in subs) {
    let searchStr = "%{" + subKey + "}";
    newText = newText.replace(searchStr, subs[subKey]);
  }
  return newText;
}

export default tSub;
