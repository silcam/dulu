import React from 'react'

import AddButton from '../../shared_components/AddButton'

import PeopleTableRow from './PeopleTableRow'

class PeopleTable extends React.PureComponent {
    newPersonForm = () => {
        this.props.setPerson(null)
    }

    render() {
        const people = this.props.people
        const strings = this.props.strings
        if (people.length == 0) {
            return <p className='loading'>{strings.Loading}</p>
        }
        return (
            <div>
                {this.props.can.create &&
                    <p style={{paddingLeft: '8px'}}>
                        <AddButton text={strings.Add_new_person}
                                handleClick={this.newPersonForm} />
                    </p>
                }
                <table className='table'>
                    <tbody>
                        {people.map((person) => {
                            return <PeopleTableRow key={person.id}
                                                person={person}
                                                strings={strings}
                                                setPerson={this.props.setPerson}
                                                selection={this.props.selection} />
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PeopleTable