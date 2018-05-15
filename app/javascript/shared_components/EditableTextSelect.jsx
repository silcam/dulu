import React from 'react'

import editableText from './editableText'
import SelectInput from './SelectInput'

/*
    Required props:
        text
        value
        field
        updateValue(field, value)
        editEnabled - boolean
        options - array of objects with display member and optional value member
*/

function GenericSelect(props) {
    const handleChange = (e) => {
        const value = e.target.value
        const text = props.options[value]
        props.save(value, text)
    }

    return (
        <SelectInput
                handleChange={handleChange}
                value={props.value}
                options={props.options}
                onBlur={props.cancel}
                autoFocus />
    )
}

const EditableTextSelect = editableText(GenericSelect)

export default EditableTextSelect