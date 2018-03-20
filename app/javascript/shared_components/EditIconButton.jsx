import React from 'react'

/*
    Required props:
        function handleClick
*/

function EditIconButton(props) {
    return(
        <button className="iconButton iconButtonWarning" onClick={props.handleClick}>
            <span className="glyphicon glyphicon-pencil"></span>
        </button>
    )
}

export default EditIconButton