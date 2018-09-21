import axios from "axios";
import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import {
  findById,
  findIndexById,
  insertInto,
  deleteFrom
} from "../../util/findById";
import { axiosDelete, statusOK } from "../../util/network";

export default function thingBoard(Board, thingParams) {
  const thingName = thingParams.name;
  const thingCompare = thingParams.compare;
  const thingsName = thingParams.pluralName || thingName + "s";
  const baseUrl = thingParams.baseUrl || `/${thingsName}`;
  const baseApiUrl = "/api" + baseUrl;

  return class ThingBoard extends React.PureComponent {
    state = {
      things: [],
      can: {}
    };

    async componentDidMount() {
      const response = await axios.get(baseApiUrl);
      if (response.data[thingsName])
        this.setState({
          things: response.data[thingsName],
          can: response.data.can
        });
      this.fetchThingIfNeeded();
    }

    async componentDidUpdate() {
      this.fetchThingIfNeeded();
    }

    fetchThingIfNeeded = () => {
      if (this.props.id) {
        let thing = findById(this.state.things, this.props.id);
        if (thing && !thing.loaded) this.fetchThing(this.props.id);
      }
    };

    fetchThing = async id => {
      const response = await axios.get(`${baseApiUrl}/${id}`);
      if (response.data[thingName])
        this.setState(prevState => {
          const thingIndex = findIndexById(prevState.things, id);
          return {
            things: update(prevState.things, {
              [thingIndex]: { $set: response.data[thingName] }
            })
          };
        });
    };

    add = async thing => {
      this.setState({ savingNew: true });
      const response = await axios.post(baseApiUrl, {
        authenticity_token: this.props.authToken,
        [thingName]: thing
      });
      if (response.data[thingName]) {
        const newThing = response.data[thingName];
        this.setState(prevState => {
          return {
            things: insertInto(prevState.things, newThing, thingCompare),
            savingNew: false
          };
        });
        this.props.history.push(`${baseUrl}/show/${newThing.id}`);
        return newThing;
      }
    };

    update = async thing => {
      const response = await axios.put(`${baseApiUrl}/${thing.id}`, {
        authenticity_token: this.props.authToken,
        [thingName]: thing
      });
      if (response.data[thingName]) {
        const newThing = response.data[thingName];
        this.setState(prevState => ({
          things: update(prevState.things, {
            [findIndexById(prevState.things, newThing.id)]: { $set: newThing }
          })
        }));
        return newThing;
      }
    };

    replace = thing => {
      this.setState(prevState => ({
        things: update(prevState.things, {
          [findIndexById(prevState.things, thing.id)]: { $set: thing }
        })
      }));
    };

    delete = async id => {
      this.props.history.push(baseUrl);
      const response = await axiosDelete(`${baseApiUrl}/${id}`, {
        authenticity_token: this.props.authToken
      });
      if (statusOK(response)) {
        this.setState(prevState => {
          return {
            things: deleteFrom(prevState.things, id)
          };
        });
        return true;
      }
    };

    render() {
      const selectedThing =
        this.props.id && findById(this.state.things, this.props.id);
      return (
        <Board
          can={this.state.can}
          savingNew={this.state.savingNew}
          add={this.add}
          update={this.update}
          delete={this.delete}
          replace={this.replace}
          selected={selectedThing}
          {...{
            [thingsName]: this.state.things
          }}
          {...this.props}
        />
      );
    }

    static propTypes = {
      id: PropTypes.string,
      authToken: PropTypes.string,
      action: PropTypes.string,
      history: PropTypes.object.isRequired
    };
  };
}
