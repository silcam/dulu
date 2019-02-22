import React, { Component } from "react";

interface IProps<T> {
  list: T[];
  render: (item: T) => Component;
}

export default function CommaList<T>(props: IProps<T>) {
  return props.list.map((item, index) => (
    <span key={index}>
      {props.render(item)}
      {index < props.list.length - 1 && ", "}
    </span>
  ));
}
