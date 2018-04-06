import React from 'react'

import ResultRow from './ResultRow'

function ResultsRows(props) {
    return (
        <React.Fragment>
            {props.results.map((result) => {
                return (
                    <React.Fragment>
                        <ResultRow result={result} padding={props.padding} />
                        {result.subresults && <ResultsRows results={result.subresults} padding='30px'/>}
                    </React.Fragment>
                )
            })}
        </React.Fragment>
    )
}

export default ResultsRows