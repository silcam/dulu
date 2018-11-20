import React from "react";
import PropTypes from "prop-types";

export default function TranslationStatus(props) {
  const biblePubs = props.language.publications.filter(
    pub => pub.kind == "Scripture"
  );
  return (
    <div>
      <h3>{props.t("Status")}</h3>
      <table>
        <tbody>
          <tr>
            <td>{status(biblePubs, props.t)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function status(pubs, t) {
  let bible = pubs.find(pub => pub.scripture_kind == "Bible");
  if (bible) return pubText(bible, t);
  let newTestament = pubs.find(pub => pub.scripture_kind == "New_testament");
  if (newTestament) return pubText(newTestament, t);
  let portions = pubs.filter(pub => pub.scripture_kind == "Portions");
  if (portions.length > 0)
    return portions.map(pub => pubText(pub, t)).join(", ");
  return t("No_scripture");
}

function pubText(pub, t) {
  let text =
    pub.scripture_kind == "Portions" ? pub.name : t(pub.scripture_kind);
  if (pub.year) text += ` (${pub.year})`;
  return text;
}

TranslationStatus.propTypes = {
  language: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
