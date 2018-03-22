import React from 'react'

import IconButton from './IconButton'

/*
    Required props:
        function handleClick
    Options props:
        string text
*/

function AddIconButton(props) {
    return(
        <IconButton icon="plus" {...props} />
    )
}

export default AddIconButton