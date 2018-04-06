import React from 'react'

import Searcher from './Searcher'

class Dashboard extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Searcher strings={this.props.strings} />
        )
    }
}

export default Dashboard