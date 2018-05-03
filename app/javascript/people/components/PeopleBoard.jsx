import React from 'react'

import ContentColumn from './ContentColumn'
import IndexColumn from './IndexColumn'

class PeopleBoard extends React.PureComponent {
    constructor(props) {
        super(props)
        let selection = null
        if (props.personId) {
            selection = {
                type: 'Person',
                id: props.personId
            }
        }
        this.state = {
            selection: selection
        }
    }

    setSelection = (selection) => {
        this.setState({
            selection: selection
        })
    }

    setPerson = (id) => {
        this.setSelection({
            type: 'Person',
            id: id
        })
    }

    setOrg = (id) => {
        this.setSelection({
            type: 'Org',
            id: id
        })
    }

    render() {
        const indexColClass = (this.state.selection) ? 'col-md-4 scrollableColumn' : 'scrollableColumn'
        return (
            <div className='row'>
                <div className={indexColClass}>
                    <IndexColumn strings={this.props.strings}
                                 selection={this.state.selection}
                                 setPerson={this.setPerson}
                                 setOrg={this.setOrg} />
                </div>
                {this.state.selection && 
                    <div className='col-md-8'>
                        <ContentColumn selection={this.state.selection}
                                       strings={this.props.strings}
                                       setSelection={this.setSelection}
                                       authToken={this.props.authToken} />
                    </div>
                }
            </div>
        )

    }
}

export default PeopleBoard