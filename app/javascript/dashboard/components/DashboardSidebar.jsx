import axios from 'axios'
import React from 'react'

import DashboardSidebarSection from './DashboardSidebarSection'

class DashboardSidebar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            menu: {}
        }
    }

    componentDidMount() {
        axios.get(`/api/programs/dashboard_list/`)
            .then(response => {
                this.setState({
                    menu: response.data
                })
                this.onSectionSelected(response.data.user)
            })
    }

    onProgramSelected = (program) => {
        this.props.setSelectedProgram(program.id)
        this.setState({
            selection: program
        })
    }

    onClusterSelected = (cluster) => {
        this.props.setSelectedCluster(cluster.id)
        this.setState({
            selection: cluster
        })
    }

    onSectionSelected = (section) => {
        const clusterIds = section.clusters.map((cluster) => {return cluster.id})
        const programIds = section.programs.map((program) => {return program.id})
        this.props.setSelectedMultiple({
            clusterIds: clusterIds,
            programIds: programIds
        })
        this.setState({
            selection: section
        })
    }

    render() {
        const menu = this.state.menu
        if (!menu.user) return <div></div>
        const userHasParticipants = menu.user.clusters.length > 0 || menu.user.programs.length > 0
        return (
            <ul className="list-unstyled">
                {userHasParticipants &&
                    <DashboardSidebarSection section={menu.user} startExpanded='true' selection={this.state.selection}
                        onSectionSelected={this.onSectionSelected} onProgramSelected={this.onProgramSelected}
                        onClusterSelected={this.onClusterSelected} />
                }
                {menu.other.lpfs.map((lpf) => {
                    return (
                        <DashboardSidebarSection key={lpf.id} section={lpf} selection={this.state.selection}
                            onSectionSelected={this.onSectionSelected} onProgramSelected={this.onProgramSelected}
                            onClusterSelected={this.onClusterSelected} />
                    )
                })}
            </ul>
        )
    }
}

export default DashboardSidebar