import editableText from './editableText'
import SearchTextInput from './SearchTextInput'

/*
    Required props:
        text
        value
        field
        updateValue(field, value) - function
        editEnabled - boolean
        queryPath - relative url
*/

const EditableTextSearchInput = editableText(SearchTextInput)

export default EditableTextSearchInput