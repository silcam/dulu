import React from "react";
import PropTypes from "prop-types";
import deepcopy from "../../util/deepcopy";
import DuluAxios from "../../util/DuluAxios";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import { SearchTextGroup } from "../shared/formGroup";
import update from "immutability-helper";
import Region from "../../models/Region";
import ProgramList from "./ProgramList";
import P from "../shared/P";
import { Link } from "react-router-dom";

export default class RegionPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: deepcopy(props.region)
    };
  }

  updateRegion = mergeRegion => {
    this.setState(prevState => ({
      region: update(prevState.region, { $merge: mergeRegion })
    }));
  };

  save = async () => {
    this.setState({ saving: true });
    try {
      const data = await DuluAxios.put(`/api/regions/${this.props.region.id}`, {
        region: Region.regionParams(this.state.region)
      });
      this.props.replaceRegion(data.region);
      this.setState({
        editing: false,
        region: deepcopy(data.region)
      });
    } catch (error) {
      this.props.setNetworkError(error);
    } finally {
      this.setState({ saving: false });
    }
  };

  delete = () => {
    if (
      confirm(
        this.props.t("confirm_delete_region", { name: this.props.region.name })
      )
    )
      this.props.deleteRegion(this.props.region.id);
  };

  invalid = () => this.state.region.name.length == 0;

  render() {
    const region = this.state.region;
    const t = this.props.t;

    return (
      <div>
        <EditActionBar
          can={region.can}
          editing={this.state.editing}
          saveDisabled={this.invalid()}
          saveInProgress={this.state.saving}
          t={t}
          edit={() => this.setState({ editing: true })}
          save={this.save}
          delete={this.delete}
          cancel={() =>
            this.setState({
              editing: false,
              region: deepcopy(this.props.region)
            })
          }
        />
        <h2>
          <TextOrEditText
            editing={this.state.editing}
            value={region.name}
            updateValue={value => this.updateRegion({ name: value })}
            t={t}
            validateNotBlank
          />
        </h2>
        <P>
          {this.state.editing ? (
            <SearchTextGroup
              label={t("LPF")}
              queryPath="/api/people/search"
              text={this.state.region.person.name || ""}
              updateValue={(id, name) =>
                this.updateRegion({ person: { id: id, name: name } })
              }
              placeholder={t("Name")}
              allowBlank
            />
          ) : (
            <h3>
              {t("LPF")}:{" "}
              <Link
                className="notBlue"
                to={`/people/${this.state.region.person.id}`}
              >
                {this.state.region.person.name}
              </Link>
            </h3>
          )}
        </P>
        <ProgramList
          editing={this.state.editing}
          region={this.state.region}
          thing="cluster"
          t={t}
          updateRegion={this.updateRegion}
        />
        <ProgramList
          editing={this.state.editing}
          region={this.state.region}
          thing="language"
          t={t}
          updateRegion={this.updateRegion}
          noTrash={true}
        />
      </div>
    );
  }
}

RegionPage.propTypes = {
  region: PropTypes.object.isRequired,
  replaceRegion: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  deleteRegion: PropTypes.func.isRequired
};
