import React from 'react'

import SaveButton from './SaveButton'

/*
    Required props:
        function handleClick
        boolean saveInProgress
*/

function SmallSaveButton(props) {
    return(
        <SaveButton handleClick={props.handleClick} saveInProgress={props.saveInProgress} 
                    extraClasses="btn-sm" />
    )
}

export default SmallSaveButton