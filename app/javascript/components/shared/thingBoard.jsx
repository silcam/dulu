import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import {
  findById,
  findIndexById,
  insertInto,
  deleteFrom
} from "../../util/arrayUtils";
import DuluAxios from "../../util/DuluAxios";

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

    handleNetworkError(tryAgain) {
      this.props.setNetworkError({ tryAgain: tryAgain });
    }

    async componentDidMount() {
      this.fetchList();
    }

    fetchList = async () => {
      try {
        const data = await DuluAxios.get(baseApiUrl);
        this.setState({
          things: data[thingsName],
          can: data.can
        });
        this.fetchThingIfNeeded();
      } catch (error) {
        this.handleNetworkError(this.fetchList);
      }
    };

    async componentDidUpdate() {
      this.fetchThingIfNeeded();
    }

    fetchThingIfNeeded = () => {
      if (this.props.id) {
        let thing = findById(this.state.things, this.props.id);
        if (thing && !thing.loaded && !this.state.networkError)
          this.fetchThing(this.props.id);
      }
    };

    fetchThing = async id => {
      try {
        const data = await DuluAxios.get(`${baseApiUrl}/${id}`);
        this.setState(prevState => {
          const thingIndex = findIndexById(prevState.things, id);
          return {
            things: update(prevState.things, {
              [thingIndex]: { $set: data[thingName] }
            })
          };
        });
      } catch (error) {
        this.handleNetworkError(() => this.fetchThing(id));
      }
    };

    add = async thing => {
      try {
        this.setState({ savingNew: true });
        const data = await DuluAxios.post(baseApiUrl, {
          [thingName]: thing
        });
        const newThing = data[thingName];
        this.setState(prevState => {
          return {
            things: insertInto(prevState.things, newThing, thingCompare),
            savingNew: false
          };
        });
        this.props.history.push(`${baseUrl}/${newThing.id}`);
        return newThing;
      } catch (error) {
        this.handleNetworkError(() => this.add(thing));
        this.setState({ savingNew: false });
      }
    };

    update = async thing => {
      try {
        const data = await DuluAxios.put(`${baseApiUrl}/${thing.id}`, {
          [thingName]: thing
        });
        const newThing = data[thingName];
        this.setState(prevState => ({
          things: update(prevState.things, {
            [findIndexById(prevState.things, newThing.id)]: { $set: newThing }
          })
        }));
        return newThing;
      } catch (error) {
        this.handleNetworkError(() => this.update(thing));
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
      try {
        await DuluAxios.delete(`${baseApiUrl}/${id}`);
        this.props.history.push(baseUrl);
        this.setState(prevState => {
          return {
            things: deleteFrom(prevState.things, id)
          };
        });
        return true;
      } catch (error) {
        this.handleNetworkError(() => this.delete(id));
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
      action: PropTypes.string,
      history: PropTypes.object.isRequired
    };
  };
}
