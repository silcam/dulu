import React from 'react'

import PersonContent from './PersonContent'
import OrgContent from './OrgContent'

class ContentColumn extends React.PureComponent {
    render() {
        const selection = this.props.selection
        return (selection.type == 'Person') ?
                    <PersonContent id={selection.id}
                                   strings={this.props.strings}
                                   setSelection={this.props.setSelection}
                                   authToken={this.props.authToken} /> :
                    <OrgContent id={selection.id}
                                strings={this.props.strings}
                                setSelection={this.props.setSelection} />
    }
}

export default ContentColumn