import React from 'react'

class MainContentMenu extends React.PureComponent {
    onTabClick = (e) => {
        this.props.onSelect(e.target.dataset.option)
    }

    render() {
        return (
            <div>
                {this.props.options.map((option) => {
                    return (
                        <button key={option} data-option={option}
                                onClick={this.onTabClick}>
                            {option}
                        </button>
                    )
                })}
            </div>
        )
    }
}

export default MainContentMenu