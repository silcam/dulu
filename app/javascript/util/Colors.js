const Colors = {
  white: "#FFFFFF",
  red: "#A93226",
  orange: "#CA6F1E",
  yellow: "#F4D03F",
  light_green: "#58D68D",
  dark_green: "#1E8449",
  light_blue: "#5DADE2",
  dark_blue: "#21618C",
  purple: "#6C3483",
  grey: "#d3d4d9"
};

Colors.foreground = bgColor => {
  switch (bgColor) {
    case Colors.red:
    case Colors.dark_green:
    case Colors.dark_blue:
    case Colors.purple:
      return "#FFFFFF";
  }
  return "#000000";
};

export default Colors;
