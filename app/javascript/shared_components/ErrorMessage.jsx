import React from 'react'

function ErrorMessage(props) {
    if (!props.message) return null

    return (
        <p className='alertBox alertRed'>
            {props.message}
        </p>
    )
}

export default ErrorMessage