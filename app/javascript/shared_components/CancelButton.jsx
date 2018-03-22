import React from 'react'

/*
    Required props:
        function handleClick
        strings
    Options props:
        string extraClasses
*/

function CancelButton(props) {
    const classes = "btn btn-danger " + (props.extraClasses || '')
    return(
        <button className={classes} onClick={props.handleClick}>
            {props.strings.Cancel}
        </button>
    )
}

export default CancelButton