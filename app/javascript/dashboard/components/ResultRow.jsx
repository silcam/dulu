import React from 'react'

function ResultRow(props) {
    const result = props.result
    return (
        <tr>
            <td style={{paddingLeft: props.padding}}>
                {result.route ? 
                    <a href={result.route   }>{result.title}</a> :
                    result.title
                }
                &nbsp;
                <small>
                    {result.description}
                </small>
            </td>
        </tr>
    )
}

export default ResultRow