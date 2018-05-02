import React from 'react'

class PeopleTableRow extends React.PureComponent {
    personClick = (e) => {
        this.props.setPerson(this.props.person.id)
        e.target.blur()
    }

    selectionMatches = () => {
        return this.props.selection &&
               this.props.selection.type == 'Person' &&
               this.props.selection.id == this.props.person.id
    }

    render() {
        const person = this.props.person
        const longVersion = !this.props.selection
        const rowClass = this.selectionMatches() ? 'bg-primary' : ''
        return (
            <tr className={rowClass}>
                <td>
                    <button className='btn-link' 
                            onClick={this.personClick} >
                        {`${person.last_name}, ${person.first_name}`}
                    </button>
                </td>
                <td>
                    {
                        person.organizations.map((org) => {
                            return org.name
                        })
                        .join(', ')
                    }
                </td>
                {longVersion &&
                    <td>
                        {person.roles.join(', ')}
                    </td>
                }
                {longVersion &&
                    <td>
                        {person.has_login && this.props.strings.Dulu_account}
                    </td>
                }
            </tr>
        )
    }
}

export default PeopleTableRow