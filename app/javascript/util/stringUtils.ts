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
