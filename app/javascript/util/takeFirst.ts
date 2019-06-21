export default function takeFirst(...args: any[]) {
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
