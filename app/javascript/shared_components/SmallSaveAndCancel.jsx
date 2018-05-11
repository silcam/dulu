import React from 'react'

import SmallCancelButton from './SmallCancelButton'
import SmallSaveButton from './SmallSaveButton'

/*
    Required props:
        function handleSave
        function handleCancel
        boolean saveInProgress
        strings
    Optional props:
        boolean floatRight
*/

function SmallSaveAndCancel(props) {
    const style = props.floatRight ? {float: 'right'} : {}
    return(
        <span style={style}>
            <SmallSaveButton handleClick={props.handleSave} saveInProgress={props.saveInProgress}
                            strings={props.strings} />&nbsp;
            <SmallCancelButton handleClick={props.handleCancel} strings={props.strings} />
        </span>
    )
}

export default SmallSaveAndCancel