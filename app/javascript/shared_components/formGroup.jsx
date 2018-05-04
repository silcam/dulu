import React from 'react'

import SelectInput from './SelectInput'
import ValidatedTextInput from './ValidatedTextInput'

/* 
    Optional props:
        label
*/

function formGroup(WrappedInput) {
    return class extends React.PureComponent {
        render() {
            const {label, ...otherProps} = this.props
            return (
                <div className='form-group'>
                    <label>
                        {label}
                    </label>
                    <WrappedInput {...otherProps} />
                </div>
            )
        }
    }
}

const SelectGroup = formGroup(SelectInput)
const ValidatedTextInputGroup = formGroup(ValidatedTextInput)

export { formGroup, SelectGroup, ValidatedTextInputGroup }