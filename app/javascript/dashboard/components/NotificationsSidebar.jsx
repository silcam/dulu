import axios from 'axios'
import React from 'react'

/**
 * Inserts variable strings into a translated string
 * @param {string} message 
 * @param {object} vars 
 * @param {object} links
 */
function t_sub(message, vars, links) {
    let newMessage = message
    for (let v in vars) {
        let searchStr = '%{' + v + '}'
        let link = `<a href="${links[v]}">${vars[v]}</a>`
        newMessage = newMessage.replace(searchStr, link)
    }
    return newMessage
}

class NotificationsSidebar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            notifications: []
        }
    }

    componentDidMount() {
        axios.get('/api/notifications/')
        .then(response => {
            this.setState({
                notifications: response.data
            })
        })
        .catch(error => {console.error(error)})
    }

    render() {
        const strings = this.props.strings
        return (
            <div>
                <h3>{strings.Notifications}</h3>
                <table className='table'><tbody>
                    {this.state.notifications.map((notification) => {
                        return (
                            <tr key={notification.id}>
                            <td dangerouslySetInnerHTML={{__html: t_sub(strings[notification.message.key], notification.message.t_vars, notification.message.links)}} />
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>  
        )
    }
}

export default NotificationsSidebar