import React, { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./Icon.css";
import update from "immutability-helper";
import { Children } from "../../../models/TypeBucket";
import { Omit } from "react-tabs";

interface IProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  iconSize?: "large" | "small";
  styleClass: "iconBlue" | "iconRed" | "iconYellow" | "iconInactive" | "icon";
  svgStyle?: CSSProperties;
  children: Children;
  position?: "right" | "left";
  valign?: "middle";
  hovertext?: string;
}

export type IconProps = Omit<Omit<IProps, "styleClass">, "children">;

/* 
SVG icons are taken from Google's Material Design Icons:
  https://material.io/resources/icons/?style=baseline

  Released under the Apache 2.0 license.

*/
export default function Icon(props: IProps) {
  let {
    iconSize,
    styleClass,
    children,
    svgStyle,
    position,
    valign,
    ...otherProps
  } = props;
  svgStyle = update(iconSizer(iconSize), { $merge: svgStyle || {} });

  return (
    <span className={styles[styleClass]} {...otherProps}>
      <span
        title={props.hovertext}
        className={positionClass(props.position, props.valign)}
      >
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
    </span>
  );
};

function positionClass(
  position: "right" | "left" | undefined,
  valign: "middle" | undefined
) {
  let hPosition = "";
  let vPosition = "";
  switch (position) {
    case "right":
      hPosition = styles.right;
      break;
    case "left":
      hPosition = styles.left;
      break;
  }

  switch (valign) {
    case "middle":
      vPosition = " " + styles.middleAlign;
      break;
  }

  return hPosition + vPosition;
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
