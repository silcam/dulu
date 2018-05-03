import React from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import OrgsTable from './OrgsTable'
import PeopleTable from './PeopleTable'

class IndexColumn extends React.PureComponent {
    render() {
        const props = this.props
        return (
            <Tabs>
                <TabList>
                    <Tab>{props.strings.People}</Tab>
                    <Tab>{props.strings.Organizations}</Tab>
                </TabList>
                <TabPanel>
                    <PeopleTable strings={props.strings}
                                 people={props.people}
                                 setPerson={props.setPerson}
                                 selection={props.selection} />
                </TabPanel>
                <TabPanel>
                    <OrgsTable strings={props.strings}
                               orgs={props.orgs} />
                </TabPanel>
            </Tabs>
        )
    }
}

export default IndexColumn