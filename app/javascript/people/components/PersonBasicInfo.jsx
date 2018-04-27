import React from 'react'

import EditableText from '../../shared_components/EditableText'

function PersonBasicInfo(props) {
    const strings = props.strings
    const person  = props.person
    return (
        <table className='table auto-width'>
            <tbody>
                <tr>
                    <th>
                        {strings.Home_country}
                    </th>
                    <td>
                        {person.home_country && person.home_country.name}
                    </td>
                </tr>
                <tr>
                    <th>
                        {strings.Email}
                    </th>
                    <td>
                        <EditableText field={'email'}
                                      text={person.email}
                                      updateText={props.updateText}
                                      editEnabled={props.editEnabled} />
                    </td>
                </tr>
                <tr>
                    <th>
                        {strings.Dulu_account}
                    </th>
                    <td>
                        {person.has_login ? strings.Yes : strings.No}
                    </td>
                </tr>
            </tbody>
        </table> 
    )
}

export default PersonBasicInfo