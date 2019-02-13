const Colors = {
  white: "#FFFFFF",
  red: "#A93226",
  orange: "#D86613",
  pale_orange: "#FA8C3B",
  yellow: "#F4D03F",
  light_green: "#58D68D",
  dark_green: "#1E8449",
  light_blue: "#5DADE2",
  dark_blue: "#21618C",
  light_purple: "#946BA4",
  purple: "#6C3483",
  grey: "#d3d4d9"
};

Colors.foreground = bgColor => {
  switch (bgColor) {
    case Colors.red:
    case Colors.orange:
    case Colors.dark_green:
    case Colors.dark_blue:
    case Colors.light_purple:
    case Colors.purple:
      return "#FFFFFF";
  }
  return "#000000";
};

export default Colors;
