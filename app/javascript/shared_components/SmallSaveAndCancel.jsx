import React from 'react'

import SmallCancelButton from './SmallCancelButton'
import SmallSaveButton from './SmallSaveButton'

/*
    Required props:
        function handleSave
        function handleCancel
        boolean saveInProgress
        strings
*/

function SmallSaveAndCancel(props) {
    return(
        <span style={{float: 'right'}}>
            <SmallSaveButton handleClick={props.handleSave} saveInProgress={props.saveInProgress}
                            strings={props.strings} />&nbsp;
            <SmallCancelButton handleClick={props.handleCancel} strings={props.strings} />
        </span>
    )
}

export default SmallSaveAndCancel