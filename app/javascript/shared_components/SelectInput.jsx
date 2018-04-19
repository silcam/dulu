import React from 'react'

/*
    Required props:
        -handleChange - function
        -value
        -options - array of objects with display member and optional value member
    Optional props:
        -extraClasses

*/

function SelectInput(props) {
    const className = "form-control " + props.extraClasses
    return (
        <select className={className} value={props.value}
                onChange={props.handleChange}>
            {props.options.map((option) => {
                const value = option.value || option.display
                return (
                    <option key={value} value={value}>
                        {option.display}
                    </option>
                )
            })}
        </select>
    )
}

export default SelectInput