import React from 'react'

class OrgTableRow extends React.PureComponent {
    orgClick = (e) => {
        this.props.setOrg(this.props.org.id)
        e.target.blur()
    }

    selectionMatches = () => {
        return this.props.selection &&
               this.props.selection.type == 'Org' &&
               this.props.selection.id == this.props.org.id
    }

    render() {
        const org = this.props.org
        const longVersion = !this.props.selection
        const rowClass = this.selectionMatches() ? 'bg-primary' : ''
        return (
            <tr className={rowClass}>
                <td>
                    <button className='btn-link'
                            onClick={this.orgClick}>
                        {org.short_name}
                    </button>
                </td>
                {longVersion &&
                    <td>
                        {org.description}
                    </td>
                }
            </tr>
        )
    }
}

export default OrgTableRow