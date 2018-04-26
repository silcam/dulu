import axios from 'axios'
import React from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import OrgsTable from './OrgsTable'
import PeopleTable from './PeopleTable'

class IndexColumn extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            people: [],
            orgs: []
        }
    }

    componentDidMount() {
        axios.get('/api/people')
            .then(response => {
                this.setState({
                    people: response.data.people
                })
            })
            .catch(error => {console.error(error)})
        
        // axios.get('/api/organizations')
        //     .then(response => {
        //         this.setState({
        //             organizations: response.data.organizations
        //         })
        //     })
        //     .catch(error => console.error(error))
    }

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
                                 people={this.state.people}
                                 setPerson={this.props.setPerson}
                                 selection={this.props.selection} />
                </TabPanel>
                <TabPanel>
                    <OrgsTable strings={props.strings}
                               orgs={this.state.orgs} />
                </TabPanel>
            </Tabs>
        )
    }
}

export default IndexColumn