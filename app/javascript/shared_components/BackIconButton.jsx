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
        <IconButton icon="arrow-left" {...props} />
    )
}

export default CloseIconButton