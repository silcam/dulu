import React from 'react'

import PlusMinusButton from '../../shared_components/PlusMinusButton'

import DashboardSidebarCluster from './DashboardSidebarCluster'
import DashboardSidebarProgram from './DashboardSidebarProgram'

class DashboardSidebarSection extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isExpanded: props.startExpanded
        }
    }

    onPlusMinusClick = () => {
        this.setState((prevState, props) => {
            return {
                isExpanded: !prevState.isExpanded
            }
        })
    }

    handleClick = () => {
        this.setState({
            isExpanded: true
        })
        this.props.onSectionSelected(this.props.section)
    }

    render() {
        return (
            <React.Fragment>
                <li className={'h4 ' + (this.props.selection == this.props.section && 'active') } >
                    <PlusMinusButton isExpanded={this.state.isExpanded} handleClick={this.onPlusMinusClick} />
                    <a href='#' onClick={this.handleClick}>
                        {this.props.section.name}
                    </a>
                </li>
                {this.state.isExpanded && this.props.section.clusters.map((cluster) => {
                    return <DashboardSidebarCluster key={cluster.id} cluster={cluster} indent={2}
                                selection={this.props.selection} onClusterSelected={this.props.onClusterSelected}
                                onProgramSelected={this.props.onProgramSelected} />
                })}
                {this.state.isExpanded && this.props.section.programs.map((program) => {
                    return <DashboardSidebarProgram key={program.id} program={program} indent={2}
                                selection={this.props.selection} onProgramSelected={this.props.onProgramSelected} />
                })}
            </React.Fragment>
        )
    }
}

export default DashboardSidebarSection