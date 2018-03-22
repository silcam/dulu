import React from 'react'

import CancelButton from './CancelButton'

/*
    Required props:
        function handleClick
        strings
*/

function SmallCancelButton(props) {
    return(
        <CancelButton handleClick={props.handleClick} extraClasses="btn-sm" strings={props.strings} />
    )
}

export default SmallCancelButton