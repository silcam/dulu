import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'

import PeopleBoard from './components/PeopleBoard'

const reactDiv = document.querySelector('#react')
const authToken = reactDiv.getAttribute('data-authenticity-token')
const strings = JSON.parse(document.getElementById('strings').innerHTML)

ReactDOM.render(
    <PeopleBoard authToken={authToken}
                 strings={strings} />,
    reactDiv
)