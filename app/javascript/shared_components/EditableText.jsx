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
        if (this.state.text != this.props.text) {
            this.props.updateText(this.props.field, this.state.text)
        }
        this.setState({
            editing: false
        })
    }

    handleInput = (e) => {
        this.setState({
            text: e.target.value
        })
    }

    render() {
        if (this.state.editing) {
            return (
                <span className='editableTextInput'>
                    <TextInput handleInput={this.handleInput}
                            value={this.state.text}
                            name={this.props.field}
                            handleEnter={this.finishEditMode}
                            handleBlur={this.finishEditMode}
                            autoFocus={true} />
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