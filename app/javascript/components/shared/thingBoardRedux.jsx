import React from "react";
import PropTypes from "prop-types";
import { findById } from "../../util/arrayUtils";
import DuluAxios from "../../util/DuluAxios";

export default function thingBoardRedux(Board, thingParams) {
  const thingName = thingParams.name;
  const thingsName = thingParams.pluralName || thingName + "s";
  const baseUrl = thingParams.baseUrl || `/${thingsName}`;
  const baseApiUrl = "/api" + baseUrl;

  return class ThingBoard extends React.PureComponent {
    state = {
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
          can: data.can
        });
        this.props.setPeople(data.people);
        this.fetchThingIfNeeded();
      } catch (error) {
        this.handleNetworkError(this.fetchList);
      }
    };

    async componentDidUpdate(prevProps) {
      if (prevProps.id != this.props.id) this.fetchThingIfNeeded();
    }

    fetchThingIfNeeded = () => {
      if (this.props.id && !this.state.networkError) {
        // let thing = findById(this.state.things, this.props.id);
        // if (thing && !thing.loaded && !this.state.networkError)
        this.fetchThing(this.props.id);
      }
    };

    fetchThing = async id => {
      try {
        const data = await DuluAxios.get(`${baseApiUrl}/${id}`);
        this.props.setPerson(data.person);
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
        this.props.addPerson(newThing);
        this.setState({ savingNew: false });
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
        this.props.setPerson(newThing);
        return newThing;
      } catch (error) {
        this.handleNetworkError(() => this.update(thing));
      }
    };

    replace = thing => {
      this.props.setPerson(thing);
    };

    delete = async id => {
      try {
        await DuluAxios.delete(`${baseApiUrl}/${id}`);
        this.props.history.push(baseUrl);
        this.props.deletePerson(id);
        return true;
      } catch (error) {
        this.handleNetworkError(() => this.delete(id));
      }
    };

    render() {
      const selectedThing =
        this.props.id && findById(this.props.people, this.props.id);
      return (
        <Board
          can={this.state.can}
          savingNew={this.state.savingNew}
          add={this.add}
          update={this.update}
          delete={this.delete}
          replace={this.replace}
          selected={selectedThing}
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
