import React from 'react'

import IconButton from './IconButton'

/* 
    Required props:
        function handleClick
    Optional props:
        string text
*/

function CheckIconButton(props) {
    return(
        <IconButton icon="ok" extraClasses="iconButtonSuccess" {...props} />
    )
}

export default CheckIconButton