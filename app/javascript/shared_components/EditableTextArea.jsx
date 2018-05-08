import React from 'react'

import editableText from './editableText'
import SmallSaveAndCancel from './SmallSaveAndCancel'
import TextArea from './TextArea'

/*
    Required props:
        strings
        text
        value
        field
        updateValue(field, value)
        editEnabled
    Optional props:
        placeholder
*/

class TextAreaWithButtons extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            text: props.text
        }
    }

    handleInput = (e) => {
        this.setState({ text: e.target.value })
    }

    save = () => {
        this.props.save(this.state.text, this.state.text)
    }

    render() {
        return (
            <div>
                <TextArea name={this.props.name}
                          value={this.state.text}
                          handleInput={this.handleInput}
                          autoFocus />
                <SmallSaveAndCancel handleSave={this.save}
                                    handleCancel={this.props.cancel}
                                    strings={this.props.strings} />
            </div>
        )
    }
}

const EditableTextArea = editableText(TextAreaWithButtons)

export default EditableTextArea