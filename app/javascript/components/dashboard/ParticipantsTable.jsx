import React from "react";

import ParticipantRow from "./ParticipantRow";
import SortPicker from "./SortPicker";
import { languageSort } from "../../util/sortFunctions";
import StyledTable from "../shared/StyledTable";

const sortFunctions = {
  language: languageSort,
  person: (a, b) => {
    const comparison = a.full_name_rev.localeCompare(b.full_name_rev);
    if (comparison == 0) return sortFunctions.language(a, b);
    return comparison;
  },
  role: (a, b) => {
    if (a.roles.length == 0 && b.roles.length > 0) return 1;
    if (b.roles.length == 0 && a.roles.length > 0) return -1;
    const comparison = a.roles.join().localeCompare(b.roles.join());
    if (comparison == 0) return sortFunctions.person(a, b);
    return comparison;
  }
};

function sortParticipants(sort, participants) {
  participants.sort(sortFunctions[sort.option.toLowerCase()]);
  if (!sort.asc) participants.reverse();
  return participants;
}

class ParticipantsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sort: {
        option: "Language",
        asc: true
      },
      participants: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.programs != nextProps.programs) {
      let participants = [];
      for (let program of nextProps.programs) {
        participants = participants.concat(program.participants);
      }
      sortParticipants(prevState.sort, participants);
      return {
        programs: nextProps.programs,
        participants: participants
      };
    }
    return null;
  }

  changeSort = sort => {
    let participants = sortParticipants(sort, this.state.participants.slice());
    this.setState({
      participants: participants,
      sort: sort
    });
  };

  render() {
    if (this.state.participants.length == 0)
      return <p>{this.props.t("No_participants")}</p>;
    const sortOptions = ["Language", "Person", "Role"];
    return (
      <div>
        <SortPicker
          sort={this.state.sort}
          options={sortOptions}
          t={this.props.t}
          changeSort={this.changeSort}
        />
        <StyledTable>
          <tbody>
            {this.state.participants.map(participant => {
              return (
                <ParticipantRow
                  key={`${participant.program_id}-${participant.id}`}
                  participant={participant}
                />
              );
            })}
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

export default ParticipantsTable;
