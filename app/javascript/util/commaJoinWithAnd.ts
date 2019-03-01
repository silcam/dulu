export default function commaJoinWithAnd(items: string[], and: string = "and") {
  if (items.length == 1) return items[0];
  return (
    items.slice(0, items.length - 1).join(", ") +
    ` ${and} ` +
    items[items.length - 1]
  );
}
