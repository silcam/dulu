import React from 'react'

/*
    Required props:
        function handleInput
        int value
        strings (date_strings)
    Optional props:
        string name
*/        

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MonthSelector(props) {
    const name = props.name || "month"
    return(
        <select className="form-control" name={name} value={String(props.value)} onChange={props.handleInput}>
            <option>{props.strings.Month}</option>
            {months.map((month, index) => {
                return(
                    <option key={index+1} value={index+1}>{props.strings.month_names_short[month]}</option>
                )
            })}
        </select>
    )
}

export default MonthSelector