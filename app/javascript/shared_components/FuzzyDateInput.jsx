import React from 'react'

import DaySelector from './DaySelector'
import MonthSelector from './MonthSelector'
import YearInput from './YearInput'

/*
    Required props:
        string date
        function handleDateInput
        function dateIsInvalid
        strings
    Optional props:
        string maxDate
        string minDate
        boolean showErrors
*/

// Jan == 1
function daysInMonth(month) {
    if (month<1 || month>12) return 31

    const days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return days[month]
}

function assembleDateString(year, month, day) {
    var s = zeroPad(year, 4)
    if (!month) return s
    s += '-' + zeroPad(month, 2)
    if (!day) return s
    s += '-' + zeroPad(day, 2)
    return s
}

function zeroPad(number, digits) {
    var s = String(number)
    while (s.length < digits) {
        s = '0' + s
    }
    return s
}

class FuzzyDateInput extends React.PureComponent {
    constructor(props) {
        super(props)
        const year = props.date.slice(0, 4)
        const errors = this.validationErrors(year)
        this.state = {
            year: year,
            month: parseInt(props.date.slice(5, 7)),
            day: parseInt(props.date.slice(8, 10)),
            errorMessage: errors
        }
    }

    componentDidMount() {
        if (this.state.errorMessage) {
            this.props.dateIsInvalid()
        }
    }

    handleInput = (e) => {
        this.setState(
            { [e.target.name]: e.target.value }, 
            () => { this.pushDate() }
        )
    }

    pushDate = () => {
        const errors = this.validationErrors(this.state.year)
        if (!errors) {
            this.props.handleDateInput(
                assembleDateString(
                    this.state.year,
                    this.state.month,
                    this.state.day
                ))
            this.setState({errorMessage: null})
        }
        else {
            this.setState({
                errorMessage: errors,
                showErrors: true
            })
            this.props.dateIsInvalid()
        }
    }

    validationErrors = (year) => {
        if (!parseInt(year)) {
            return this.props.strings.Enter_valid_year
        }
        return null
    }

    showErrors = () => {
        return (
            (this.state.showErrors || this.props.showErrors) &&
            this.state.errorMessage
        )
    }

    render() {
        var showErrors = this.showErrors()
        return(
            <div className="fuzzyDateInput autoWidthFormElements">
                <DaySelector handleInput={this.handleInput} value={this.state.day}
                                maxValue={daysInMonth(this.state.month)} strings={this.props.strings} />   
                <MonthSelector handleInput={this.handleInput} value={this.state.month}
                        strings={this.props.strings} />
                <YearInput handleInput={this.handleInput} value={this.state.year}
                        strings={this.props.strings} />
                <br/ >
                <span className={showErrors && 'errorMessage'}>
                    {showErrors ? 
                        this.state.errorMessage :
                        this.props.strings.Month_day_optional
                    }
                </span>
            </div>
        )
    }
}

export default FuzzyDateInput