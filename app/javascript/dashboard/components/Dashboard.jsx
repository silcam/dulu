import axios from 'axios'
import React from 'react'

import DashboardSidebar from './DashboardSidebar'
import MainContent from './MainContent'
import NotificationsSidebar from './NotificationsSidebar'
import Searcher from './Searcher'
import { arrayDelete } from '../../util/arrayUtils'

class Dashboard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            programs: [],
            loading: 0,
            neededProgramIds: [],
            neededClusterIds: []
        }
    }

    cache = {
        clusters: {},
        programs: {}
    }

    cacheCluster = (id, programs) => {
        this.cache.clusters[id] = programs
        for (let program of programs) {
            this.cache.programs[program.id] = program
        }
    }

    addLoading = () => {
        this.setState((prevState) => {
            return {
                loading: prevState.loading + 1
            }
        })
    }

    removeLoading = () => {
        this.setState((prevState) => {
            return {
                loading: prevState.loading - 1
            }
        })
    }

    fetchProgram = (id) => {
        this.addLoading()
        axios.get(`/api/programs/${id}/dashboard/`)
            .then(response => {
                this.removeLoading()
                this.cache.programs[id] = response.data
                this.setState((prevState) => {
                    if (prevState.neededProgramIds.includes(id)) {
                        let neededProgramIds = arrayDelete(prevState.neededProgramIds, id)
                        return {
                            programs: prevState.programs.concat([response.data]),
                            neededProgramIds: neededProgramIds
                        }
                    }
                    return null
                })
            })
            .catch(error => {
                console.error(error)
                this.removeLoading()
            })
    }

    fetchCluster = (id) => {
        this.addLoading()
        axios.get(`/api/clusters/${id}/dashboard/`)
            .then(response => {
                this.removeLoading()
                this.cacheCluster(id, response.data.programs)
                this.setState((prevState) => {
                    if (prevState.neededClusterIds.includes(id)) {
                        let neededClusterIds = arrayDelete(prevState.neededClusterIds, id)
                        return {
                            programs: prevState.programs.concat(response.data.programs),
                            neededClusterIds: neededClusterIds
                        }
                    }
                    return null
                })
            })
            .catch(error => {
                console.error(error)
                this.removeLoading()
            })
    }

    setSelectedCluster = (id) => {
        if (this.cache.clusters[id]) {
            this.setState({
                neededClusterIds: [],
                neededProgramIds: [],
                programs: this.cache.clusters[id]
            })
        }
        else {
            this.setState({
                programs: [],
                neededClusterIds: [id],
                neededProgramIds: []
            })
            this.fetchCluster(id)
        }
    }

    setSelectedProgram = (id) => {
        if (this.cache.programs[id]) {
            this.setState({
                neededClusterIds: [],
                neededProgramIds: [],
                programs: [this.cache.programs[id]]
            })
        }
        else {
            this.setState({
                neededClusterIds: [],
                neededProgramIds: [id],
                programs: []
            })
            this.fetchProgram(id)
        }
    }

    setSelectedMultiple = (selection) => {
        this.setState({
            neededClusterIds: [],
            neededProgramIds: [],
            programs: []
        })
        for (let clusterId of selection.clusterIds) {
            if (this.cache.clusters[clusterId]) {
                this.setState((prevState) => {
                    return {
                        programs: prevState.programs.concat(this.cache.clusters[clusterId])
                    }
                })
            }
            else {
                this.setState((prevState) => {
                    return {   
                        neededClusterIds: prevState.neededClusterIds.concat([clusterId])
                    }
                })
                this.fetchCluster(clusterId)
            }
        }
        for (let programId of selection.programIds) {
            if (this.cache.programs[programId]) {
                this.setState((prevState) => {
                    return {
                        programs: prevState.programs.concat(this.cache.programs[programId])
                    }
                })
            }
            else {
                this.setState((prevState) => {
                    return {
                        neededProgramIds: prevState.neededProgramIds.concat([programId])
                    }
                })
                this.fetchProgram(programId)
            }
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='col-sm-3 col-md-2 sidebar' id='dashboardSidebar'>
                    <DashboardSidebar setSelectedProgram={this.setSelectedProgram} 
                                      setSelectedCluster={this.setSelectedCluster}
                                      setSelectedMultiple={this.setSelectedMultiple} />
                </div>
                <div className='col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <Searcher strings={this.props.strings}
                                      queryPath='/api/search' />
                            {this.state.loading > 0 && <p className='alertBox alertYellow'>{this.props.strings.Loading}</p>}
                            <MainContent programs={this.state.programs} 
                                         strings={this.props.strings}
                                         viewPrefs={this.props.viewPrefs} />
                        </div>
                        <div className='col-md-3'>
                            <NotificationsSidebar strings={this.props.strings}
                                      authenticityToken={this.props.authenticityToken} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard