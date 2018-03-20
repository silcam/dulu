import React from 'react'

/*
    Required props:
        function handleClick
    Options props:
        string text
*/

function AddIconButton(props) {
    return(
        <button className="iconButton iconButtonSuccess" onClick={props.handleClick}>
            <span className="glyphicon glyphicon-plus"></span>
            &nbsp;{props.text}
        </button>
    )
}

export default AddIconButton