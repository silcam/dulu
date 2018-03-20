import React from 'react'

/*
    Required props:
        function handleClick
    Options props:
        string extraClasses
*/

function CancelButton(props) {
    const classes = "btn btn-danger " + (props.extraClasses || '')
    return(
        <button className={classes} onClick={props.handleClick}>
            Cancel
        </button>
    )
}

export default CancelButton