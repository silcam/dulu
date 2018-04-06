import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'

import Dashboard from './components/Dashboard'

const dashboardDiv = document.querySelector('#dashboard')
// const authenticity_token = workshopsDiv.getAttribute('data-authenticity-token')
const authenticity_token = "yo"
var strings = JSON.parse(document.getElementById('strings').innerHTML)

ReactDOM.render(
    <Dashboard      authenticity_token={authenticity_token}
                    strings={strings} />, 
    dashboardDiv
)