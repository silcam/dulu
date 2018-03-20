import React from 'react'

import CancelButton from './CancelButton'

/*
    Required props:
        function handleClick
*/

function SmallCancelButton(props) {
    return(
        <CancelButton handleClick={props.handleClick} extraClasses="btn-sm" />
    )
}

export default SmallCancelButton