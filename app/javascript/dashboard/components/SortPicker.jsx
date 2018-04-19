import React from 'react'

function SortPicker(props) {
    const options = props.options
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
                                {(props.sort == option) ?
                                    <u>{props.strings[option]}</u> :
                                    <button className='btn-link' 
                                            onClick={()=>{props.changeSort(option)}}>
                                        {props.strings[option]}
                                    </button>
                                }
                            </li>
                        )
                    })}
                </ul>
            </small>
        </div>
    )
}

export default SortPicker