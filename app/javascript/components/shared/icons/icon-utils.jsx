export function iconSizer(size) {
  switch (size) {
    case "large":
      return { width: "32px", height: "32px" };
    case "small":
      return { width: "16px", height: "16px" };
  }
  return {};
}
