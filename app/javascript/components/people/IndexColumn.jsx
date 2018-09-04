import React from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import OrgsTable from "./OrgsTable";
import PeopleTable from "./PeopleTable";

class IndexColumn extends React.PureComponent {
  render() {
    const props = this.props;
    const defaultIndex = props.defaultTab == "organizations" ? 1 : 0;
    return (
      <Tabs defaultIndex={defaultIndex}>
        <TabList>
          <Tab>{props.strings.People}</Tab>
          <Tab>{props.strings.Organizations}</Tab>
        </TabList>
        <TabPanel>
          <PeopleTable
            strings={props.strings}
            people={props.people}
            setPerson={props.setPerson}
            selection={props.selection}
            can={props.peopleCan}
          />
        </TabPanel>
        <TabPanel>
          <OrgsTable
            strings={props.strings}
            orgs={props.orgs}
            setOrg={props.setOrg}
            selection={props.selection}
            can={props.orgCan}
          />
        </TabPanel>
      </Tabs>
    );
  }
}

export default IndexColumn;
