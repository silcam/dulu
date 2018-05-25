import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'

import Dashboard from './components/Dashboard'

const dashboardDiv = document.querySelector('#dashboard')
const authenticityToken = dashboardDiv.getAttribute('data-authenticity-token')
const strings = JSON.parse(document.getElementById('strings').innerHTML)
const viewPrefs = JSON.parse(document.getElementById('viewPrefs').innerHTML)

ReactDOM.render(
    <Dashboard      authenticityToken={authenticityToken}
                    strings={strings}
                    viewPrefs={viewPrefs} />, 
    dashboardDiv
)