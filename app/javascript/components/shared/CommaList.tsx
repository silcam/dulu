import React from "react";

interface IProps<T> {
  list: T[];
  render: (item: T) => JSX.Element | string;
  separator?: string;
}

export default function CommaList<T>(props: IProps<T>) {
  const separator = props.separator || ", ";
  return (
    <span>
      {props.list.map((item, index) => (
        <span key={index}>
          {props.render(item)}
          {index < props.list.length - 1 && separator}
        </span>
      ))}
    </span>
  );
}
