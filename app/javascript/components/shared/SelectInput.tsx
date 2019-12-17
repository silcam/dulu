import React from "react";
import { T } from "../../i18n/i18n";

interface IProps {
  setValue: (value: string) => void;
  value: string;
  options: Array<{ value: string; display: string }>;
  name?: string;
  autoFocus?: boolean;
  extraClasses?: string;
  onBlur?: () => void;
}

export default function SelectInput(props: IProps) {
  const className = "form-control " + props.extraClasses;
  const name = props.name || "basic_select";

  return (
    <select
      className={className}
      name={name}
      value={props.value}
      autoFocus={props.autoFocus || false}
      onChange={e => props.setValue(e.target.value)}
      onBlur={props.onBlur}
    >
      {props.options.map(option => {
        const value = option.value || option.display;
        return (
          <option key={value} value={value}>
            {option.display}
          </option>
        );
      })}
    </select>
  );
}

SelectInput.translatedOptions = (
  options: readonly string[],
  t: T,
  keyPrefix?: string,
  sort = true
) => {
  const selectOptions: { value: string; display: string }[] = options.map(
    option => ({
      value: option,
      display: keyPrefix ? t(`${keyPrefix}.${option}`) : t(option)
    })
  );
  if (sort) {
    selectOptions.sort((a, b) => a.display.localeCompare(b.display));
  }
  return selectOptions;
};

SelectInput.indexedOptions = (options: readonly string[]) => {
  const selectOptions: {
    value: string;
    display: string;
  }[] = options.map((opt, index) => ({ value: `${index}`, display: opt }));
  return selectOptions;
};

SelectInput.fromObjectOptions = (object: { [key: string]: string }) => {
  return Object.keys(object).map(key => {
    return {
      value: key,
      display: object[key]
    };
  });
};
