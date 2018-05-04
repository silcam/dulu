import React from 'react'

import tSub from '../../util/tSub'

import CloseIconButton from '../../shared_components/CloseIconButton'
import DangerButton from '../../shared_components/DangerButton'
import DeleteIconButton from '../../shared_components/DeleteIconButton'
import EditableTextBox from '../../shared_components/EditableTextBox'
import backedModel from '../../shared_components/backedModel'
import SaveIndicator from '../../shared_components/SaveIndicator'

class BasicOrgContent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { deleting: false }
    }

    componentDidUpdate(prevProps) {
        if (this.state.deleting && this.props.organization != prevProps.organization) {
            this.setState({deleting: false})
        }
    }

    clickClose = () => {
        this.props.setSelection(null)
    }

    clickDelete = () => {
        this.setState({deleting: true})
    }

    cancelDelete = () => {
        this.setState({deleting: false})
    }

    deleteOrg = () => {
        const orgId = this.props.organization.id
        this.props.delete(() => {
            this.props.deleteOrg(orgId)
        })
    }

    updateField = (field, value) => {
        this.props.update({ [field]: value })
    }

    render() {
        const strings = this.props.strings
        const org = this.props.organization

        if (org == null) {
            return <p className='loading'>{strings.Loading}</p>
        }

        const editEnabled = this.props.can.update
        const deleteWarning = tSub(strings.delete_person_warning, {name: org.name})
        const deleteButtonText = tSub(strings.delete_person, {name: org.name})

        return (
            <div>
                <h3 style={{color: '#aaa'}}>
                    <CloseIconButton handleClick={this.clickClose} />
                    {this.props.can.destroy &&
                        <DeleteIconButton handleClick={this.clickDelete} />
                    }
                </h3>

                {this.state.deleting &&
                    <DangerButton handleClick={this.deleteOrg}
                                  handleCancel={this.cancelDelete}
                                  message={deleteWarning}
                                  buttonText={deleteButtonText}
                                  strings={strings} />
                }

                <SaveIndicator strings={strings}
                               saving={this.props.saving > 0}
                               saved={this.props.savedChanges} />

                <h2>
                    <EditableTextBox field='name'
                                     text={org.name}
                                     value={org.name}
                                     updateValue={this.updateField}
                                     editEnabled={editEnabled}
                                     validateNotBlank
                                     strings={strings} />
                </h2>
                <h3>
                    <EditableTextBox field='abbreviation'
                                     text={org.abbreviation}
                                     value={org.abbreviation}
                                     updateValue={this.updateField}
                                     editEnabled={editEnabled}
                                     validateNotBlank
                                     strings={strings} />
                </h3>
                <p>
                    {org.description}
                </p>
            </div>
        )
    }
}

const OrgContent = backedModel(BasicOrgContent, '/api/organizations', 'organization')

export default OrgContent