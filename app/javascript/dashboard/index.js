import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'

import Dashboard from './components/Dashboard'

const dashboardDiv = document.querySelector('#dashboard')
const authenticityToken = dashboardDiv.getAttribute('data-authenticity-token')
var strings = JSON.parse(document.getElementById('strings').innerHTML)

ReactDOM.render(
    <Dashboard      authenticityToken={authenticityToken}
                    strings={strings} />, 
    dashboardDiv
)