import React from 'react'

function SaveIndicator(props) {
    if (!props.saving && !props.saved) return null

    return (
        <p className='loading'>
            {props.saving ? 
                props.strings.Saving :
                props.strings.All_changes_saved
            }
        </p>
    )
}

export default SaveIndicator