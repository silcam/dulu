import React from 'react'

import editableText from './editableText'

/*
    Required props:
        text
        value
        field
        updateValue(field, value)
        editEnabled - boolean
        strings
*/

function YesNoSelect(props) {
    const handleChange = (e) => {
        const text = (e.target.value) ? props.strings.Yes : props.strings.No
        props.save(e.target.value, text)
    }

    const className = props.extraClasses ? `form-control ${props.extraClasses}` : 'form-control'
    return (
        <select name={props.name}
                value={props.value}
                onChange={handleChange}
                className={className}
                autoFocus
                onBlur={props.cancel}>

            <option value={true}>
                {props.strings.Yes}
            </option>

            <option value={false}>
                {props.strings.No}
            </option>
        </select>
    )
}

const EditableTextYesNo = editableText(YesNoSelect)

export default EditableTextYesNo