import React from 'react'

class PeopleTableRow extends React.PureComponent {
    personClick = (e) => {
        this.props.setPerson(this.props.person.id)
        e.target.blur()
    }

    render() {
        const person = this.props.person
        const longVersion = !this.props.selection
        return (
            <tr>
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