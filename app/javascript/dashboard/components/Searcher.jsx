import axios from 'axios'
import React from 'react'

import TextInput from '../../shared_components/TextInput'

import ResultsRows from './ResultsRows'

class Searcher extends React.PureComponent {
    queryNum = 0
    displayedQuery = 0

    constructor(props) {
        super(props)
        this.state = {
            query: '',
            results: [],
            noResults: false
        }
    }

    getQueryNum = () => {
        this.queryNum += 1
        // console.log("QueryNum: " + this.queryNum)
        return this.queryNum
    }

    setRefireTimer = () => {
        this.refireTimer = setTimeout(this.onRefireTimer, 400)
    }

    onRefireTimer = () => {
        this.refireTimer = null
        if (this.nextQuery) {
            this.search(this.nextQuery)
            this.nextQuery = null
        }
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        const query = e.target.value
        if (query.length == 0) {
            this.displayedQuery = this.getQueryNum()
            this.nextQuery = null
            this.setState({
                results: [],
                noResults: false
            })
        }
        else {
            this.search(e.target.value)
        }
    }

    goToFirstResult = () => {
        if (this.state.results[0] && this.state.results[0].route) {
            window.location.href = this.state.results[0].route
        }
    }

    search = (query) => {
        if (query.length > 2) {
            if (this.refireTimer) {
                this.nextQuery = query
                return
            }

            const qNum = this.getQueryNum()
            axios.get(`/api/search`, {
                params: { q: query }
            })
            .then(response => {
                if (qNum > this.displayedQuery) {
                    this.displayedQuery = qNum
                    this.setState({
                        results: response.data,
                        noResults: (response.data.length == 0)
                    })
                }
            })
            .catch(error => console.error(error))

            this.setRefireTimer()
        }
    }

    render() {
        return (
            <div>
                <TextInput handleInput={this.handleInput} name="query" value={this.state.query}
                    placeholder={this.props.strings.Search_prompt} handleEnter={this.goToFirstResult} />

                {this.state.noResults && <p>No Results</p>}

                {(this.state.results.length > 0) && 
                    <table className='table'>
                        <tbody>
                            <ResultsRows results={this.state.results} padding='0' />
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export default Searcher