import axios from 'axios'
import React from 'react'

import ContentColumn from './ContentColumn'
import IndexColumn from './IndexColumn'

function findSpotForPerson(person, people) {
    let index = 0
    while ( index < people.length &&
            person.last_name.localeCompare(people[index].last_name) > 0) {
        ++index
    }
    return index
}

function findSpotForOrg(org, orgs) {
    let index = orgs.findIndex((o) => {
        return org.name.localeCompare(o.name) < 0
    })
    if (index < 0) index = orgs.length
    return index
}

class PeopleBoard extends React.PureComponent {
    constructor(props) {
        super(props)
        let selection = null
        if (props.personId) {
            selection = {
                type: 'Person',
                id: props.personId
            }
        }
        else if (props.orgId) {
            selection = {
                type: 'Org',
                id: props.orgId
            }
        }
        this.state = {
            selection: selection,
            people: [],
            orgs: [],
            peopleCan: {},
            orgCan: {}
        }
    }

    componentDidMount() {
        axios.get('/api/people')
            .then(response => {
                this.setState({
                    people: response.data.people,
                    peopleCan: response.data.can
                })
            })
            .catch(error => {console.error(error)})
        
        axios.get('/api/organizations')
            .then(response => {
                this.setState({
                    orgs: response.data.organizations,
                    orgCan: response.data.can
                })
            })
            .catch(error => console.error(error))
    }

    setSelection = (selection) => {
        this.setState({
            selection: selection
        })
    }

    setPerson = (id) => {
        this.setSelection({
            type: 'Person',
            id: id
        })
    }

    setOrg = (id) => {
        this.setSelection({
            type: 'Org',
            id: id
        })
    }

    addPerson = (person) => {
        const selection = {
            type: 'Person',
            id: person.id
        }
        this.setState((prevState) => {
            let index = findSpotForPerson(person, prevState.people)
            let people = prevState.people.slice(0, index)
            people.push(person)
            people = people.concat(prevState.people.slice(index))
            return {
                people: people,
                selection: selection
            }
        })
    }

    addOrg = (org) => {
        const selection = {
            type: 'Org',
            id: org.id
        }
        this.setState((prevState) => {
            let index = findSpotForOrg(org, prevState.orgs)
            let orgs = prevState.orgs.slice(0, index)
            orgs.push(org)
            orgs = orgs.concat(prevState.orgs.slice(index))
            return {
                orgs: orgs,
                selection: selection
            }
        })
    }

    deletePerson = (id) => {
        this.setState((prevState) => {
            const people = prevState.people
            let index = people.findIndex((p) => {
                return p.id == id
            })
            let newPeople = people.slice(0, index).concat(people.slice(index + 1))
            return {
                people: newPeople,
                selection: null
            }
        })
    }

    deleteOrg = (id) => {
        this.setState((prevState) => {
            const orgs = prevState.orgs
            let index = orgs.findIndex((o) => { return o.id==id })
            let newOrgs = orgs.slice(0, index).concat(orgs.slice(index + 1))
            return {
                orgs: newOrgs,
                selection: null
            }
        })
    }

    render() {
        const indexColClass = (this.state.selection) ? 'narrow' : ''
        return (
            <div className=''>
                <div className={indexColClass} id='indexColumn'>
                    <IndexColumn strings={this.props.strings}
                                 defaultTab={this.props.tab}
                                 selection={this.state.selection}
                                 people={this.state.people}
                                 orgs={this.state.orgs}
                                 setPerson={this.setPerson}
                                 setOrg={this.setOrg}
                                 peopleCan={this.state.peopleCan}
                                 orgCan={this.state.orgCan} />
                </div>
                {this.state.selection && 
                    <div id='peopleOrgContent'>
                        <ContentColumn selection={this.state.selection}
                                       strings={this.props.strings}
                                       setSelection={this.setSelection}
                                       addPerson={this.addPerson}
                                       deletePerson={this.deletePerson}
                                       addOrg={this.addOrg}
                                       deleteOrg={this.deleteOrg}
                                       authToken={this.props.authToken} />
                    </div>
                }
            </div>
        )

    }
}

export default PeopleBoard