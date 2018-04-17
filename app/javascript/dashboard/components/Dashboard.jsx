import axios from 'axios'
import React from 'react'

import DashboardSidebar from './DashboardSidebar'
import NotificationsSidebar from './NotificationsSidebar'
import Searcher from './Searcher'
import MainContent from './MainContent';

class Dashboard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            programs: [], 
            mainContentSelection: 'TranslationActivities',
            loading: 0
        }
    }

    addLoading = () => {
        this.setState((prevState, props) => {
            return {
                loading: prevState.loading + 1
            }
        })
    }

    removeLoading = () => {
        this.setState((prevState, props) => {
            return {
                loading: prevState.loading - 1
            }
        })
    }

    addSelectedProgram = (id) => {
        this.addLoading()
        axios.get(`/api/programs/${id}/dashboard/`)
            .then(response => {
                this.removeLoading()
                this.setState((prevState, props) => {
                    return {
                        programs: prevState.programs.concat([response.data])
                    }
                })
            })
            .catch(error => {
                console.error(error)
                this.removeLoading()
            })
    }

    addSelectedCluster = (id) => {
        this.addLoading()
        axios.get(`/api/clusters/${id}/dashboard/`)
            .then(response => {
                this.removeLoading()
                this.setState((prevState, props) => {
                    return {
                        programs: prevState.programs.concat(response.data.programs)
                    }
                })
            })
            .catch(error => {
                console.error(error)
                this.removeLoading()
            })
    }

    setSelectedCluster = (id) => {
        this.setState({
            programs: []
        })
        this.addSelectedCluster(id)
    }

    setSelectedProgram = (id) => {
        this.setState({
            programs: []
        })
        this.addSelectedProgram(id)
    }

    setSelectedMultiple = (selection) => {
        this.setState({
            programs: []
        })
        for (let clusterId of selection.clusterIds) {
            this.addSelectedCluster(clusterId)
        }
        for (let programId of selection.programIds) {
            this.addSelectedProgram(programId)
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
                            <Searcher strings={this.props.strings} />
                            {this.state.loading > 0 && <p className='loading'>{this.props.strings.Loading}</p>}
                            <MainContent programs={this.state.programs} strings={this.props.strings} />
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