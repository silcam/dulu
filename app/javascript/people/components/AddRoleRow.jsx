import React from 'react'

import AddIconButton from '../../shared_components/AddIconButton'
import SelectInput from '../../shared_components/SelectInput'
import SmallAddButton from '../../shared_components/SmallAddButton'
import SmallCancelButton from '../../shared_components/SmallCancelButton'

class AddRoleRow extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            adding: false,
            role: props.person.grantable_roles[0].value
        }
    }

    setAddingMode = () => {
        this.setState({
            adding: true
        })
    }

    cancelAddingMode = () => {
        this.setState({
            adding: false
        })
    }

    addRole = () => {
        let url = '/api/person_roles'
        let data = {
            person_id: this.props.person.id,
            role: this.state.role
        }
        this.props.rawPost(url, data)
        this.setState({ adding: false })
    }

    handleRoleSelect = (e) => {
        this.setState({
            role: e.target.value
        })
    }

    render() {
        const strings = this.props.strings
        if (this.state.adding) {
            return (
                <tr>
                    <td>
                        <SelectInput
                            value={this.state.role}
                            options={this.props.person.grantable_roles}
                            handleChange={this.handleRoleSelect}
                            autoFocus />
                    </td>
                    <td>
                        <SmallAddButton
                            handleClick={this.addRole}
                            strings={strings} />
                        &nbsp;
                        <SmallCancelButton
                            handleClick={this.cancelAddingMode}
                            strings={strings} />
                    </td>
                </tr>
            )
        }
        return (
            <tr>
                <td colSpan='2'>
                    <AddIconButton
                        handleClick={this.setAddingMode} />
                </td>
            </tr>
        )
    }
}

export default AddRoleRow