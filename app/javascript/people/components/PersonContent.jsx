import React from 'react'

import CloseIconButton from '../../shared_components/CloseIconButton'
import EditableTextBox from '../../shared_components/EditableTextBox'
import backedModel from '../../shared_components/backedModel'
import SaveIndicator from '../../shared_components/SaveIndicator'

import EventsTable from './EventsTable'
import ParticipantsTable from './ParticipantsTable'
import PersonBasicInfo from './PersonBasicInfo'
import RolesTable from './RolesTable'

class BasicPersonContent extends React.PureComponent {
    clickClose = () => {
        this.props.setSelection(null)
    }

    updateField = (field, value, callback) => {
        this.props.update({ [field]: value }, callback)
    }

    render() {
        const strings = this.props.strings
        const person = this.props.person
        const editEnabled = this.props.can.update

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
                    <EditableTextBox field='first_name'
                                  text={person.first_name}
                                  value={person.first_name}
                                  updateValue={this.updateField}
                                  editEnabled={editEnabled}
                                  validateNotBlank={true}
                                  strings={strings} />
                    &nbsp;
                    <EditableTextBox field='last_name'
                                  text={person.last_name}
                                  value={person.last_name}
                                  updateValue={this.updateField}
                                  editEnabled={editEnabled}
                                  validateNotBlank={true}
                                  strings={strings} />
                </h2>

                <PersonBasicInfo strings={strings} 
                                 person={person}
                                 updateText={this.updateField}
                                 editEnabled={editEnabled} />

                <RolesTable person={person}
                            strings={strings}
                            editEnabled={editEnabled}
                            rawPost={this.props.rawPost} />

                <ParticipantsTable person={person}
                                   strings={strings} />

                <EventsTable person={person}
                             strings={strings} />

            </div>
        )
    }
}

const PersonContent = backedModel(BasicPersonContent, '/api/people', 'person')

export default PersonContent