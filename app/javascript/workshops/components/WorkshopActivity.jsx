import React from 'react'
import axios from 'axios'

import Workshop from './Workshop'
import NewWorkshopForm from './NewWorkshopForm'

/*
    Required props:
        number activity_id
        string authenticity_token
*/

class WorkshopActivity extends React.Component {
    constructor (props) {
        super (props)
        this.state = {
            workshops: []
        }
    }

    componentDidMount () {
        axios.get(`/api/activities/${this.props.activity_id}/workshops/`)
        .then(response => {
            console.log(response.data)
            this.setState({workshops: response.data})
        })
        .catch(error => console.error(error))
    }

    handleNewWorkshop = (workshop) => {
        this.setState((prevState, props) => {
            prevState.workshops.push(workshop)
            return { workshops: prevState.workshops }
        })
    }

    deleteWorkshop = (id) => {
        axios({
                method: 'delete',
                url: `/api/workshops/${id}`, 
                data: {
                    authenticity_token: this.props.authenticity_token
                }
            })
            .then(response => {
                this.setState((prevState, props) => {
                    const i = prevState.workshops.findIndex(ws => ws.id===id)
                    prevState.workshops.splice(i, 1)
                    return { workshops: prevState.workshops }
                })
            })
            .catch(error => console.error(error))
    }

    render () {
        return (
            <div>
                <h3>Workshops</h3>
                <table className="table">
                    <tbody>
                        {this.state.workshops.map((workshop) => {
                            return(
                                <Workshop key={workshop.id} workshop={workshop} 
                                    authenticity_token={this.props.authenticity_token}
                                    deleteWorkshop={this.deleteWorkshop}
                                    displayDelete={this.state.workshops.length > 1} />
                            )
                        })}
                    </tbody>
                </table>
                <NewWorkshopForm handleNewWorkshop={this.handleNewWorkshop} authenticity_token={this.props.authenticity_token} 
                                    activity_id={this.props.activity_id} />
            </div>
        )
    }
}

export default WorkshopActivity