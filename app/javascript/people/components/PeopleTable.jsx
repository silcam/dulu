import React from 'react'
import PeopleTableRow from './PeopleTableRow'

class PeopleTable extends React.PureComponent {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         people: []
    //     }
    // }

    render() {
        const people = this.props.people
        if (people.length == 0) {
            return <p className='loading'>{this.props.strings.Loading}</p>
        }
        return (
            <table className='table'>
                <tbody>
                    {people.map((person) => {
                        return <PeopleTableRow key={person.id}
                                               person={person}
                                               strings={this.props.strings}
                                               setPerson={this.props.setPerson}
                                               selection={this.props.selection} />
                    })}
                </tbody>
            </table>
        )
    }
}

export default PeopleTable