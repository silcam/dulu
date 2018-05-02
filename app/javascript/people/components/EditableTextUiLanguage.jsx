import React from 'react'

import editableText from '../../shared_components/editableText'

function UiLanguageSelect(props) {
    const strings = props.strings

    const handleChange = (e) => {
        const text = strings.languages[e.target.value]
        props.save(e.target.value, text)
    }

    const className = 'form-control'
    return (
        <select name={props.name}
                value={props.value}
                onChange={handleChange}
                className={className}
                autoFocus
                onBlur={props.cancel} >
            
            <option value='en'>
                {strings.languages.en}
            </option>

            <option value='fr'>
                {strings.languages.fr}
            </option>
        </select>
    )
}

const EditableTextUiLanguage = editableText(UiLanguageSelect)

export default EditableTextUiLanguage