import React from 'react'

import AddIconButton from './AddIconButton'
import TextInput from './TextInput'

class EditableText extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            text: props.text
        }
    }

    setEditMode = () => {
        this.setState({
            editing: true
        })
    }

    finishEditMode = () => {
        if (!this.state.errorMessage && this.state.text != this.props.text) {
            this.props.updateText(this.props.field, this.state.text)
        }
        this.setState({
            editing: false
        })
    }

    handleInput = (e) => {
        const errorMessage = this.validate(e.target.value)
        this.setState({
            text: e.target.value,
            errorMessage: errorMessage
        })
    }

    // Returns an error message for invalid text, null for valid
    validate = (text) => {
        if (this.props.validateNotBlank && text.length == 0) {
            return this.props.strings.validation.Not_blank
        }
        return null
    }

    render() {
        const editEnabled = this.props.editEnabled || (this.props.editEnabled == undefined)
        if (!editEnabled) {
            return this.props.text
        }
        if (this.state.editing) {
            return (
                <span className='editableTextInput'>
                    <TextInput handleInput={this.handleInput}
                            value={this.state.text}
                            name={this.props.field}
                            handleEnter={this.finishEditMode}
                            handleBlur={this.finishEditMode}
                            autoFocus={true}
                            errorMessage={this.state.errorMessage} />
                </span>
            )
        }
        if (this.props.text.length == 0) {
            return (
                <span style={{color: '#aaa'}}>
                    <AddIconButton handleClick={this.setEditMode} />
                </span>
            )
        }
        return (
            <span className='editableText'
                  onClick={this.setEditMode}>
                {this.props.text}
                &nbsp;
                <span className='glyphicon glyphicon-pencil'></span>
            </span>
        )
    }
}

export default EditableText