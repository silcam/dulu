import React from 'react'

function SortPicker(props) {
    const options = ['Language', 'Book', 'Stage', 'Last_update']
    return (
        <div>
            <small>
            <ul className='list-inline'>
                <li>
                    <label>{props.strings.Sort}:</label>
                </li>
                {options.map((option) => {
                    return (
                        <li key={option}>
                            <label className='checkBoxLabel'>
                                <input type='radio' checked={props.sort == option} 
                                        onChange={props.changeSort} value={option} />
                                {props.strings[option]}
                            </label>
                        </li>
                    )
                })}
            </ul>
            </small>
        </div>
    )
}

export default SortPicker