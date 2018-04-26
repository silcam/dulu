import React from 'react'

import IconButton from './IconButton'

/*
    Required props:
        function handleClick
    Optional props:
        string text
*/

function CloseIconButton(props) {
    return (
        <IconButton icon="remove" extraClasses="iconButtonDanger" {...props} />
    )
}

export default CloseIconButton