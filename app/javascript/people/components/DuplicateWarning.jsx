import React from 'react'

function DuplicateWarning(props) {
    const duplicatePerson = props.duplicatePerson
    const strings = props.strings
    return (
        <div className='bs-callout callout-red' style={{marginBottom: '12px'}}>
            <h4>
                {`${duplicatePerson.full_name} ${strings.already_exists}`}
            </h4>
            <p>
                {strings.duplicate_warning_start}&nbsp;
                <a href={`/people/${duplicatePerson.id}`} target='_blank'>
                    {duplicatePerson.full_name}
                </a>&nbsp;
                {strings.duplicate_warning_end}
            </p>
            <label>
                <input type='checkbox'
                       name='not_a_duplicate'
                       checked={props.not_a_duplicate || false}
                       onChange={props.handleCheck} />
                &nbsp;
                {strings.confirm_different_person}
            </label>
        </div>
    )
}

export default DuplicateWarning