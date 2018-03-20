import React from 'react'

/*
    Required props:
        function handleClick
        string text
        string classes
        
    Options props:
        string extraClasses
*/

function BootstrapButton(props) {
    const classes = "btn btn-danger " + (props.extraClasses || '')
    return(
        <button className={classes} onClick={props.handleClick}>
            Cancel
        </button>
    )
}

export default CancelButton