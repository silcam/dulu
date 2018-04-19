import React from 'react'

function Checkbox(props) {
    return (
        <label className='checkBoxLabel'>
            <input type='checkbox' checked={props.checked}
                    onChange={props.handleChange} value={props.value} />
            {props.label}
        </label>
    )

}

export default Checkbox