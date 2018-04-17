import React from 'react'

function DashboardSidebarProgram(props) {
    const indent = props.indent || 0
    const indentString = (new Array(indent)).fill('\u00A0').join('') // \u00A0 = Non-breaking space
    return (
        <li className={'programItem ' + (props.selection==props.program && 'active')}>
            {indentString}
            <a href='#' onClick={() => {props.onProgramSelected(props.program)}}>
                {props.program.name}
            </a>
        </li>
    )
}

export default DashboardSidebarProgram