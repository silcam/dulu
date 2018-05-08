import React from 'react'

import DeleteIconButton from '../../shared_components/DeleteIconButton'

import AddRoleRow from './AddRoleRow'

class RolesTable extends React.PureComponent {
    deleteRole = (role) => {
        let url = '/api/person_roles/finish'
        let data = {
            person_id: this.props.person.id,
            role: role
        }
        this.props.rawPost(url, data)
    }

    render() {
        const person = this.props.person
        const strings = this.props.strings
        const editEnabled = this.props.editEnabled
        return (
            <div id='rolesTable'>
                <h3>
                    {strings.Roles}
                </h3>
                <table className='table'>
                    <tbody>
                        {person.roles.map((role) => {
                            return (
                                <tr key={role.value}>
                                    <td>
                                        {role.display}
                                    </td>
                                    {editEnabled &&
                                        <td>
                                            <DeleteIconButton 
                                                handleClick={()=>{this.deleteRole(role.value)}} />
                                        </td>
                                    }
                                </tr>
                            )
                        })}
                        {person.grantable_roles.length > 0 &&
                            <AddRoleRow
                                person={person}
                                strings={strings}
                                editEnabled={editEnabled}
                                rawPost={this.props.rawPost} />
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default RolesTable