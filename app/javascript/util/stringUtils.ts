export function allMatches(
  str: string,
  pattern: RegExp,
  group: number = 0
): string[] {
  if (!pattern.global)
    throw "Pattern must be global! (You forgot the 'g' after the ending slash.)";
  let result;
  let found: string[] = [];
  while ((result = pattern.exec(str)) !== null) {
    found.push(result[group]);
  }
  return found;
}

export function fixCaps(text: string) {
  if (text == text.toLowerCase() || text == text.toUpperCase()) {
    return text
      .split(/\s+/)
      .map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return text;
}

export function splitOnLastSpace(str: string): [string, string] {
  const i = str.lastIndexOf(" ");
  return i < 0 ? [str, ""] : [str.slice(0, i), str.slice(i + 1)];
}

export function urlify(str: string) {
  if (str.length == 0) return str;
  return str.startsWith("http") ? str : `http://${str}`;
}

export function caseInsenstiveEqual(a: string, b: string): boolean {
  return a.toLocaleLowerCase() == b.toLocaleLowerCase();
}
