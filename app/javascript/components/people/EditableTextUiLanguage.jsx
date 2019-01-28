import React from "react";

import editableText from "../shared/editableText";

function UiLanguageSelect(props) {
  const t = props.t;

  const handleChange = e => {
    const text = t("languages")[e.target.value];
    props.save(e.target.value, text);
  };

  const className = "form-control";
  return (
    <select
      name={props.name}
      value={props.value}
      onChange={handleChange}
      className={className}
      autoFocus
      onBlur={props.cancel}
    >
      <option value="en">{t("languages.en")}</option>

      <option value="fr">{t("languages.fr")}</option>
    </select>
  );
}

const EditableTextUiLanguage = editableText(UiLanguageSelect);

export default EditableTextUiLanguage;
