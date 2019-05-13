import React, { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./Icon.css";
import update from "immutability-helper";
import { Children } from "../../../models/TypeBucket";
import { Omit } from "react-tabs";

interface IProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  iconSize?: "large" | "small";
  styleClass: "iconBlue" | "iconRed" | "iconYellow";
  svgStyle?: CSSProperties;
  children: Children;
}

export type IconProps = Omit<Omit<IProps, "styleClass">, "children">;

export default function Icon(props: IProps) {
  let { iconSize, styleClass, children, svgStyle, ...otherProps } = props;
  svgStyle = update(iconSizer(iconSize), { $merge: svgStyle || {} });

  return (
    <span className={styles[styleClass]} {...otherProps}>
      <svg
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </span>
  );
}

function iconSizer(size?: "large" | "small") {
  switch (size) {
    case "large":
      return { width: "32px", height: "32px" };
    case "small":
      return { width: "16px", height: "16px" };
  }
  return {};
}
