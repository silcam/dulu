import React from 'react'

import searchInterface from './searchInterface'

/*
    Required props:
        cancel - function
        save - function
        queryPath - relative url
*/

class BasicSearchTextInput extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            text: props.text,
            selection: -1
        }
    }
    
    handleChange = (e) => {
        this.setState({ text: e.target.value })
        this.props.updateQuery(e.target.value)
    }

    handleKeyDown = (e) => {
        switch(e.key) {
            case 'ArrowUp':
                this.moveSelectionUp()
                return
            case 'ArrowDown':
                this.moveSelectionDown()
                return
            case 'Enter':
                this.handleEnter()
                return
        }
    }

    moveSelectionUp = () => {
        this.setState((prevState) => {
            let selection  = prevState.selection
            if (selection > -1) --selection
            return {
                selection: selection
            }
        })
    }

    moveSelectionDown = () => {
        this.setState((prevState, props) => {
            let selection = prevState.selection
            if (selection < props.results.length - 1) ++selection
            return {
                selection: selection
            }
        })
    }

    setSelection = (index) => {
        this.setState({ selection: index })
    }

    clearSelection = () => {
        this.setState({ selection: -1 })
    }

    handleBlur = () => {
        this.props.cancel()
    }

    handleEnter = () => {
        if (this.props.results[this.state.selection]) {
            this.save(this.props.results[this.state.selection])
        }
        else if (this.props.results[0]) {
            this.save(this.props.results[0])
        }
        else {
            this.props.cancel()
        }
    }

    save = (country) => {
        this.props.save(country.id, country.name)
    }

    render() {
        return (
            <div className='searchInputText'>
                <input type='text'
                    className='form-control'
                    value={this.state.text}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                    autoFocus />
                <ul onMouseLeave={this.clearSelection}>
                    {this.props.results.map((country, index) => {
                        const className = (index == this.state.selection)? 'selected' : ''
                        return (
                            <li key={country.id} 
                                className={className}
                                onMouseDown={()=>{this.save(country)}}
                                onMouseEnter={()=>{this.setSelection(index)}}>
                                {country.name}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

const SearchTextInput = searchInterface(BasicSearchTextInput, 2)

export default SearchTextInput