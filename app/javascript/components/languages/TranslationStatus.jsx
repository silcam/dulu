import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";

export default class TranslationStatus extends React.Component {
  state = { pubs: [] };

  async componentDidMount() {
    const data = await DuluAxios.get(
      `/api/languages/${this.props.language.id}/pubs`
    );
    if (data) {
      this.setState({ pubs: data.pubs });
    }
  }

  render() {
    const biblePubs = this.state.pubs.filter(pub => pub.kind == "Scripture");
    return (
      <div>
        <h3>{this.props.t("Status")}</h3>
        <table>
          <tbody>
            <tr>
              <td>{status(biblePubs, this.props.t)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
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
