import React from 'react'

/*
    Required props:
        function handleInput
        string value
        string name

    Optional props:
        string placeholder
        string errorMessage
        function handleEnter
*/

function TextInput(props) {
    const handleKeyDown = (e) => {
        if (e.key == 'Enter') {
            props.handleEnter()
        }
    }

    const divClass = props.errorMessage ? "form-group errorMessage" : "form-group"

    return(
        <div className={divClass}>
            <input type="text" className="form-control" name={props.name}
                    onChange={props.handleInput} onKeyDown={handleKeyDown}
                    placeholder={props.placeholder} value={props.value} />
            <div>
                {props.errorMessage}
            </div>
        </div>
    )
}

export default TextInput