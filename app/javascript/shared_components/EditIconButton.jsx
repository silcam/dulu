import React from 'react'

import IconButton from './IconButton'

/*
    Required props:
        function handleClick
*/

function EditIconButton(props) {
    return(
        <IconButton icon="pencil" extraClasses="iconButtonWarning" {...props} />
    )
}

export default EditIconButton