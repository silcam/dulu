import React from 'react'

/*
    Required props:
        function handleClick
*/

function DeleteIconButton(props) {
    return(
        <button className="iconButton iconButtonDanger" onClick={props.handleClick}>
            <span className="glyphicon glyphicon-trash"></span>
        </button>
    )
}

export default DeleteIconButton