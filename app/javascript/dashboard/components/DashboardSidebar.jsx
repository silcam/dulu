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

    sectionClustersAndPrograms = (section) => {
        let clusters = section.clusters || []
        let programs = section.programs || []
        let subSections = section.sections || []
        for (let subSection of subSections) {
            let subSectionClustersAndPrograms = this.sectionClustersAndPrograms(subSection)
            clusters = clusters.concat(subSectionClustersAndPrograms.clusters)
            programs = programs.concat(subSectionClustersAndPrograms.programs)
        }
        return {
            clusters: clusters,
            programs: programs
        }
    }

    onSectionSelected = (section) => {
        let clustersAndPrograms = this.sectionClustersAndPrograms(section)
        const clusterIds = clustersAndPrograms.clusters.map((cluster) => {return cluster.id})
        const programIds = clustersAndPrograms.programs.map((program) => {return program.id})
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
                {menu.countries.map((country) => {
                    return (
                        <DashboardSidebarSection key={country.id} 
                                                 section={country} 
                                                 selection={this.state.selection}
                                                 startExpanded={country.startExpanded}
                                                 onSectionSelected={this.onSectionSelected} 
                                                 onProgramSelected={this.onProgramSelected}
                                                 onClusterSelected={this.onClusterSelected}
                                                 header='h3' />
                    )
                })}
                {userHasParticipants &&
                    <DashboardSidebarSection section={menu.user} 
                                             startExpanded={menu.user.startExpanded} 
                                             selection={this.state.selection}
                                             onSectionSelected={this.onSectionSelected} 
                                             onProgramSelected={this.onProgramSelected}
                                             onClusterSelected={this.onClusterSelected}
                                             header='h4' />
                }
            </ul>
        )
    }
}

export default DashboardSidebar