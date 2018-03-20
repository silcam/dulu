import React from 'react'
import axios from 'axios'

import TextInput from '../../shared_components/TextInput'
import SmallSaveButton from '../../shared_components/SmallSaveButton'
import SmallCancelButton from '../../shared_components/SmallCancelButton'
import EditIconButton from '../../shared_components/EditIconButton'
import DeleteIconButton from '../../shared_components/DeleteIconButton'

/*
    Required props:
        object workshop (fields: id, name)
        string authenticity_token
        function deleteWorkshop
        boolean displayDelete
*/

class Workshop extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            editing: false,
            saving: false,
            name: props.workshop.name
        }
    }

    editMode = () => {
        this.setState({editing: true, saving: false})
    }

    cancelEdit = () => {
        this.setState({
            name: this.props.workshop.name,
            editing: false,
            saving: false
        })
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    delete = () => {
        this.props.deleteWorkshop(this.props.workshop.id)
    }

    save = () => {
        this.setState({saving: true})
        const id = this.props.workshop.id
        const workshop = {
            name: this.state.name
        }
        axios.put(`/api/workshops/${id}/`, 
            { 
                authenticity_token: this.props.authenticity_token,
                workshop: workshop
            })
            .then(response => {
                this.setState({
                    editing: false,
                    saving: false,
                    name: response.data.name
                })
            })
            .catch(error => {
                console.error(error)
                this.setState({
                    editing: true,
                    saving: false
                })
            })
    }

    render () {
        if (this.state.editing){
            return(
                <tr>
                    <td>
                        <TextInput name="name" value={this.state.name} handleInput={this.handleInput}
                                handleEnter={this.save} />
                    </td>
                    <td align="right">
                        <SmallSaveButton handleClick={this.save} saveInProgress={this.state.saving} />&nbsp;
                        <SmallCancelButton handleClick={this.cancelEdit} />
                    </td>
                </tr>
            )
        } else {
            return(
                <tr>
                    <td>{this.state.name}</td>
                    <td align="right">
                        <EditIconButton handleClick={this.editMode} />
                        {this.props.displayDelete && <DeleteIconButton handleClick={this.delete} />}
                    </td>
                </tr>
            )
        }
    }
}

export default Workshop