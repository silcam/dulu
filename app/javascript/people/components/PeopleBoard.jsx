import axios from 'axios'
import React from 'react'

import ContentColumn from './ContentColumn'
import IndexColumn from './IndexColumn'

function findSpotFor(person, people) {
    let index = 0
    while ( index < people.length &&
            person.last_name.localeCompare(people[index].last_name) > 0) {
        ++index
    }
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
        this.state = {
            selection: selection,
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
            let index = findSpotFor(person, prevState.people)
            let people = prevState.people.slice(0, index)
            people.push(person)
            people = people.concat(prevState.people.slice(index))
            return {
                people: people,
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

    render() {
        const indexColClass = (this.state.selection) ? 'col-md-4 scrollableColumn' : 'scrollableColumn'
        return (
            <div className='row'>
                <div className={indexColClass}>
                    <IndexColumn strings={this.props.strings}
                                 selection={this.state.selection}
                                 people={this.state.people}
                                 orgs={this.state.orgs}
                                 setPerson={this.setPerson}
                                 setOrg={this.setOrg} />
                </div>
                {this.state.selection && 
                    <div className='col-md-8 scrollableColumn'>
                        <ContentColumn selection={this.state.selection}
                                       strings={this.props.strings}
                                       setSelection={this.setSelection}
                                       addPerson={this.addPerson}
                                       deletePerson={this.deletePerson}
                                       authToken={this.props.authToken} />
                    </div>
                }
            </div>
        )

    }
}

export default PeopleBoard