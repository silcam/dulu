import React from 'react'

/*
    Required Props: 
        function handleClick
        boolean saveInProgress
        strings
    Optional props:
        string extraClasses
*/

function SaveButton(props) {
    const text = props.saveInProgress ? props.strings.Saving : props.strings.Save
    const classes = "btn btn-primary " + (props.extraClasses || '')
    return(
        <button className={classes} onClick={props.handleClick} disabled={props.saveInProgress}>
            {text}
        </button>
    )
}

export default SaveButton