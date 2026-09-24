import React, { useContext } from "react";
import { IPeriodStrict } from "../../models/Event";
import I18nContext from "../../contexts/I18nContext";
import SelectInput from "./SelectInput";
import P from "./P";
import { T } from "../../i18n/i18n";

interface IProps {
  period: IPeriodStrict;
  setPeriod: (newPeriod: IPeriodStrict) => void;
}

export default function PeriodInput(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <div>
      <YearMonthInput
        {...props.period.start}
        label={t("Start")}
        setValue={newStart =>
          props.setPeriod({ end: props.period.end, start: newStart })
        }
      />
      <YearMonthInput
        {...props.period.end}
        label={t("End")}
        setValue={newEnd =>
          props.setPeriod({ start: props.period.start, end: newEnd })
        }
      />
    </div>
  );
}

interface YMProps {
  year: number;
  month: number;
  label: string;
  setValue: (value: { year: number; month: number }) => void;
}

function YearMonthInput(props: YMProps) {
  const t = useContext(I18nContext);
  return (
    <P>
      <label className="block">{props.label}</label>
      <SelectInput
        value={props.month.toString()}
        setValue={month =>
          props.setValue({ year: props.year, month: parseInt(month) })
        }
        options={monthsList(t)}
        name="month"
      />
      <SelectInput
        value={props.year.toString()}
        setValue={year =>
          props.setValue({ month: props.month, year: parseInt(year) })
        }
        options={toOptions(yearsList())}
        name="year"
      />
    </P>
  );
}

function monthsList(t: T) {
  // String(i + 1), not i + 1: SelectInput declares `value: string` and React stringifies
  // it into the DOM anyway, so this is the same markup -- but it is now the type the prop
  // asks for. The number went unnoticed because `t` returned `any`, which made this whole
  // map `any[]`. Identical at runtime: the values are 1..12, so SelectInput's
  // `option.value || option.display` fallback never fired before and does not now. See 8d.
  return t<string[]>("month_names_short").map((month, i) => ({
    value: String(i + 1),
    display: month
  }));
}

function yearsList() {
  const thisYear = new Date().getFullYear();
  const oldestYear = 1969; // Beginning of SIL Cameroon
  const listLength = thisYear - oldestYear + 1;
  return new Array(listLength).fill(0).map((_val, index) => thisYear - index);
}

function toOptions(list: number[]) {
  return list.map(num => ({ value: num.toString(), display: num.toString() }));
}

export function defaultPeriod(): IPeriodStrict {
  const now = new Date();
  return {
    start: { year: now.getFullYear(), month: 1 },
    end: { year: now.getFullYear(), month: now.getMonth() + 1 }
  };
}
