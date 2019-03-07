export function orBlank(
  str: number | string | null | undefined,
  before: string = "",
  after: string = ""
) {
  return str ? before + `${str}` + after : "";
}
