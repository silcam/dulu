import React, { useContext, useState } from "react";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  text: string;
  limit?: number;
}

export default function Truncate(props: IProps) {
  const t = useContext(I18nContext);
  const limit = props.limit || 300;
  const text = props.text || "";
  const [expanded, setExpanded] = useState(false);

  if (expanded || text.length < limit) return <span>{text}</span>;

  const truncText = truncIt(text, limit);

  return (
    <span>
      {truncText}...{" "}
      <button className="link" onClick={() => setExpanded(true)}>
        {t("See_more")}
      </button>
    </span>
  );
}

function truncIt(text: string, limit: number) {
  let truncText = text.slice(0, limit);
  if (truncText.includes(" "))
    truncText = truncText.slice(0, truncText.lastIndexOf(" "));
  return truncText;
}
