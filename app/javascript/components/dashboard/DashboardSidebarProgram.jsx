import React from "react";

class DashboardSidebarProgram extends React.PureComponent {
  componentDidMount() {
    if (this.props.program.startSelected) {
      this.props.onProgramSelected(this.props.program);
    }
  }

  render() {
    const props = this.props;
    const indent = props.indent || 0;
    const indentString = new Array(indent).fill("\u00A0").join(""); // \u00A0 = Non-breaking space
    return (
      <li
        className={
          "programItem " + (props.selection == props.program && "active")
        }
      >
        {indentString}
        <a
          href="#"
          onClick={() => {
            props.onProgramSelected(props.program);
          }}
        >
          {props.program.name}
        </a>
      </li>
    );
  }
}

export default DashboardSidebarProgram;
