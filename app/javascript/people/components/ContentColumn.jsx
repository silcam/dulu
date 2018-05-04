import React from 'react'

import NewPersonForm from './NewPersonForm'
import OrgContent from './OrgContent'
import PersonContent from './PersonContent'

class ContentColumn extends React.PureComponent {
    render() {
        const selection = this.props.selection
        if (selection.type == 'Person') {
            if (selection.id == null) {
                return <NewPersonForm setSelection={this.props.setSelection}
                                      strings={this.props.strings}
                                      authToken={this.props.authToken}
                                      addPerson={this.props.addPerson} />
            }
            else { // non-null id
                return <PersonContent id={selection.id}
                                strings={this.props.strings}
                                setSelection={this.props.setSelection}
                                deletePerson={this.props.deletePerson}
                                authToken={this.props.authToken} />
            }
        }
        else { // Organization selected
            if (selection.id == null) {
                return null
            }
            else { // Non-null id
                return <OrgContent id={selection.id}
                            strings={this.props.strings}
                            setSelection={this.props.setSelection} />
            }
        }
                    
    }
}

export default ContentColumn