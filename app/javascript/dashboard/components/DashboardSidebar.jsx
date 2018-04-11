import axios from 'axios'
import React from 'react'

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

    render() {
        const menu = this.state.menu
        return (
            <ul className="nav nav-sidebar">
                {menu.user && 
                    <React.Fragment>
                        <li className="h4"><a href="#">{menu.user.name}</a></li>
                        {menu.user.clusters.map((cluster) => {
                            return(
                                <li key={cluster.id}>
                                    <a href="#" onClick={() => {this.props.setSelectedCluster(cluster.id)}}>
                                        {cluster.displayName}
                                    </a>
                                </li>
                            )
                        })}
                        {menu.user.programs.map((program) => {
                            return (
                                <li key={program.id}>
                                    <a href="#" onClick={() => {this.props.setSelectedProgram(program.id)}}>
                                        {program.name}
                                    </a>
                                </li>
                            )
                        })}
                    </React.Fragment>
                }
            </ul>
        )
    }
}

export default DashboardSidebar