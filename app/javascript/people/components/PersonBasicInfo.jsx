import React from 'react'

import selectOptionsFromObject from '../../util/selectOptionsFromObject'

import EditableTextBox from '../../shared_components/EditableTextBox'
import EditableTextSearchInput from '../../shared_components/EditableTextSearchInput'
import EditableTextSelect from '../../shared_components/EditableTextSelect'
import EditableTextYesNo from '../../shared_components/EditableTextYesNo'

import EditableTextUiLanguage from './EditableTextUiLanguage'

function PersonBasicInfo(props) {
    const strings = props.strings
    const person  = props.person
    const homeCountry = person.home_country || {id: null, name: ''}
    const hasLoginText = person.has_login ? strings.Yes : strings.No
    const emailPrefOptions = selectOptionsFromObject(strings.email_prefs)

    const updateUiLang = (field, value) => {
        props.updateText(field, value, () => {
            window.location.href = `/people/${person.id}`
        })
    }

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
                {!person.isUser &&
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
                }
                {person.isUser &&
                    <React.Fragment>
                        <tr>
                            <th>
                                {strings.dulu_preferred_language}
                            </th>
                            <td>
                                <EditableTextUiLanguage text={strings.languages[person.ui_language]}
                                                        value={person.ui_language}
                                                        field='ui_language'
                                                        updateValue={updateUiLang}
                                                        editEnabled={props.editEnabled}
                                                        strings={strings} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {strings.Email_frequency}
                            </th>
                            <td>
                                <EditableTextSelect 
                                        text={strings.email_prefs[person.email_pref]}
                                        value={person.email_pref}
                                        field={'email_pref'}
                                        updateValue={props.updateText}
                                        editEnabled={props.editEnabled}
                                        options={emailPrefOptions} />
                            </td>
                        </tr>
                    </React.Fragment>
                }
            </tbody>
        </table> 
    )
}

export default PersonBasicInfo