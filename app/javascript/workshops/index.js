import React from 'react'
import ReactDOM from 'react-dom'
import WorkshopActivity from './components/WorkshopActivity'

const workshopsDiv = document.querySelector('#workshops')
const activity_id = workshopsDiv.getAttribute('data-activity-id')
const authenticity_token = workshopsDiv.getAttribute('data-authenticity-token')
var strings = JSON.parse(document.getElementById('workshops-strings').innerHTML)

// Doesn't work for some reason?
// strings.getString = (key) => {
//     // if (this[key] === undefined) { return key }
//     // return this[key]
//     return this[key]
// }

ReactDOM.render(
    <WorkshopActivity activity_id={activity_id} 
                    authenticity_token={authenticity_token}
                    strings={strings} />, 
    workshopsDiv
)