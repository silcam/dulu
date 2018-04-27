import React from 'react'

import EditableTextBox from '../../shared_components/EditableTextBox'
import EditableTextSearchInput from '../../shared_components/EditableTextSearchInput'
import EditableTextYesNo from '../../shared_components/EditableTextYesNo'

function PersonBasicInfo(props) {
    const strings = props.strings
    const person  = props.person
    const homeCountry = person.home_country || {id: null, name: ''}
    const hasLoginText = person.has_login ? strings.Yes : strings.No
    return (
        <table className='table auto-width'>
            <tbody>
                <tr>
                    <th>
                        {strings.Home_country}
                    </th>
                    <td>
                        <EditableTextSearchInput queryPath='/api/countries/search'
                                         text={homeCountry.name}
                                         value={homeCountry.id}
                                         field={'country_id'}
                                         editEnabled={props.editEnabled}
                                         updateValue={props.updateText} />
                    </td>
                </tr>
                <tr>
                    <th>
                        {strings.Email}
                    </th>
                    <td>
                        <EditableTextBox field={'email'}
                                      text={person.email}
                                      value={person.email}
                                      updateValue={props.updateText}
                                      editEnabled={props.editEnabled} />
                    </td>
                </tr>
                <tr>
                    <th>
                        {strings.Dulu_account}
                    </th>
                    <td>
                        <EditableTextYesNo text={hasLoginText}
                                           value={person.has_login}
                                           field='has_login'
                                           updateValue={props.updateText}
                                           editEnabled={props.editEnabled}
                                           strings={strings} />
                    </td>
                </tr>
            </tbody>
        </table> 
    )
}

export default PersonBasicInfo