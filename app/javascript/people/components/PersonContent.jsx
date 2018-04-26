import React from 'react'

import CloseIconButton from '../../shared_components/CloseIconButton'
import EditableText from '../../shared_components/EditableText'
import backedModel from '../../shared_components/backedModel'
import SaveIndicator from '../../shared_components/SaveIndicator'

import PersonBasicInfo from './PersonBasicInfo'

class BasicPersonContent extends React.PureComponent {
    clickClose = () => {
        this.props.setSelection(null)
    }

    updateField = (field, value) => {
        this.props.update({ [field]: value })
    }

    render() {
        const strings = this.props.strings
        const person = this.props.person

        if (person == null) {
            return <p className='loading'>{strings.Loading}</p>
        }
        return (
            <div>
                <h3 style={{color: '#aaa'}}>
                    <CloseIconButton handleClick={this.clickClose} />
                </h3>
                <SaveIndicator strings={strings}
                               saving={this.props.saving > 0}
                               saved={this.props.savedChanges} />
                <h2>
                    <EditableText field='first_name'
                                  text={person.first_name} 
                                  updateText={this.updateField} />
                    &nbsp;
                    <EditableText field='last_name'
                                  text={person.last_name}
                                  updateText={this.updateField} />
                </h2>

                <PersonBasicInfo strings={strings} 
                                 person={person}
                                 updateText={this.updateField} />

            </div>
        )
    }
}

const PersonContent = backedModel(BasicPersonContent, '/api/people', 'person')

export default PersonContent