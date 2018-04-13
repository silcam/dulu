import axios from 'axios'
import React from 'react'

import DashboardSidebar from './DashboardSidebar'
import NotificationsSidebar from './NotificationsSidebar'
import Searcher from './Searcher'
import MainContentMenu from './MainContentMenu';
import MainContent from './MainContent';

class Dashboard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            programs: [], 
            mainContentSelection: 'TranslationActivities'
        }
    }

    setSelectedCluster = (id) => {
        axios.get(`/api/clusters/${id}/dashboard`)
        .then(response => {
            this.setState({
                programs: response.data.programs
            })
        })
    }

    setSelectedProgram = (id) => {
        axios.get(`/api/programs/${id}/dashboard`)
        .then(response => {
            this.setState({
                programs: [
                    response.data
                ]
            })
        })
        .catch(error => console.error(error))
    }

    onMainContentMenuSelection = (selection) => {
        this.setState({
            mainContentSelection: selection
        })
    }

    // DEBUG CODE ===================================================================
    componentDidMount() {
        this.setSelectedCluster(5)
    }
    // ==============================================================================

    render() {
        return (
            <div className='row'>
                <div className='col-sm-3 col-md-2 sidebar' id='sidebar'>
                    <DashboardSidebar setSelectedProgram={this.setSelectedProgram} setSelectedCluster={this.setSelectedCluster} />
                </div>
                <div className='col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <Searcher strings={this.props.strings} />
                            <MainContentMenu options={['TranslationActivities', 'Participants']} 
                                             onSelect={this.onMainContentMenuSelection}/>
                            <MainContent programs={this.state.programs} mainContentSelection={this.state.mainContentSelection} />
                        </div>
                        <div className='col-md-3'>
                            <NotificationsSidebar strings={this.props.strings} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard