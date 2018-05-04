import React from 'react'

/*
    Required props:
        handleInput(e)
        value
        name

    Optional Props:
        rows
        placeholder
        errorMessage
        handleBlur
        extraClasses
        autoFocus
*/

function TextArea(props) {
    const rows = props.rows || 4
    return (
        <div>
            <textarea className='form-control'
                    rows={rows}
                    name={props.name}
                    onChange={props.handleInput}
                    value={props.value} />
        </div>
    )
}

export default TextArea