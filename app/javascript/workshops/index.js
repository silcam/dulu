import React from 'react'
import ReactDOM from 'react-dom'
import WorkshopActivity from './components/WorkshopActivity'

const workshopsDiv = document.querySelector('#workshops')
const activity_id = workshopsDiv.getAttribute('data-activity-id')
const authenticity_token = workshopsDiv.getAttribute('data-authenticity-token')

ReactDOM.render(
    <WorkshopActivity activity_id={activity_id} 
                    authenticity_token={authenticity_token} />, 
    workshopsDiv
)