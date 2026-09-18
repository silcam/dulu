// The rest parameter is a *tuple* (`[...T]`), not an array (`T[]`), and the difference is
// the whole point. With `T[]` the compiler unifies every argument into one `T` and picks a
// single candidate -- given takeFirst(null, undefined, "", { 4: 4 }) it settles on the
// literal type `""` and then rejects the object. Capturing the arguments as a tuple keeps
// each one's type, and `T[number]` is the union of them, which is what this function
// actually returns. Callers pass deliberately mixed types: takeFirst(item.year, t("Bible"))
// is `number | null` against `string`.
export default function takeFirst<T extends unknown[]>(
  ...args: [...T]
): T[number] {
  for (let i = 0; i < args.length; ++i) {
    if (args[i]) return args[i];
  }
  return args[args.length - 1];
}

export function takeFirstNonBlank(...args: readonly string[]) {
  for (let i = 0; i < args.length; ++i) {
    if (/\S/.test(args[i])) return args[i];
  }
  return args[args.length - 1];
}
