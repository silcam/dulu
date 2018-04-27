import React from 'react'

import editableText from './editableText'
import TextInput from './TextInput'

class TextBox extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            text: props.text,
            errorMessage: null
        }
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

    handleEnter = () => {
        this.save()
    }

    handleBlur = () => {
        this.save()
    }

    save = () => {
        if (this.state.errorMessage) {
            this.props.cancel()
        }
        else {
            this.props.save(this.state.text, this.state.text)
        }
    }

    render() {
        return <TextInput value={this.state.text}
                          name={this.props.name}
                          handleInput={this.handleInput}
                          handleEnter={this.handleEnter}
                          handleBlur={this.handleBlur}
                          errorMessage={this.state.errorMessage}
                          autoFocus={true} />
    }
}

const EditableTextBox = editableText(TextBox)

export default EditableTextBox