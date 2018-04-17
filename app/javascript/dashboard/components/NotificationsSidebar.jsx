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
        let replacement = links[v] ?
            `<a href="${links[v]}">${vars[v]}</a>` :
            vars[v]
        newMessage = newMessage.replace(searchStr, replacement)
    }
    return newMessage
}

class NotificationsSidebar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            unreadNotifications: false,
            moreAvailable: false
        }
        this.nextNotificationsPage = 0
    }

    componentDidMount() {
        this.getNotifications()
    }

    getNotifications = () => {
        axios.get(`/api/notifications?page=${this.nextNotificationsPage}`)
            .then(response => {
                this.setState((prevState, props) => {
                    return {
                        notifications: prevState.notifications.concat(response.data.notifications),
                        unreadNotifications: prevState.unreadNotifications || response.data.unreadNotifications,
                        moreAvailable: response.data.moreAvailable
                    }
                })
            })
            .catch(error => { console.error(error) })
        this.nextNotificationsPage += 1
    }

    clickSeeMore = (e) => {
        this.getNotifications()
        e.target.blur()
    }

    markAllRead = () => {
        this.setState((prevState, props) => {
            const notifications = prevState.notifications
            axios.post('/api/notifications/mark_read/', {
                authenticity_token: this.props.authenticityToken,
                from: notifications[notifications.length - 1].id,
                to: notifications[0].id
            })
                .catch(error => { console.error(error) })
            let newNotifications = notifications.slice()
            for (let notification of newNotifications) {
                notification.read = true
            }
            return {
                notifications: newNotifications,
                unreadNotifications: false
            }
        })
    }

    render() {
        const strings = this.props.strings
        return (
            <div>
                <h3 style={{ marginTop: 0 }}>
                    {strings.Notifications}
                </h3>
                {this.state.unreadNotifications &&
                    <button className='btn-link' onClick={this.markAllRead}>
                        {this.props.strings.Mark_all_read}
                    </button>
                }
                <table className='table'><tbody>
                    {this.state.notifications.map((notification) => {
                        return (
                            <tr key={notification.id}>
                                <td className={notification.read ? '' : 'unreadNotification'}
                                    dangerouslySetInnerHTML={{
                                        __html: t_sub(strings[notification.message.key],
                                            notification.message.t_vars,
                                            notification.message.links
                                        )
                                    }} />
                            </tr>
                        )
                    })}
                    <tr>
                        <td>
                            {this.state.moreAvailable &&
                                <button className='btn-link' onClick={this.clickSeeMore}
                                        style={{padding: 0}}>
                                    {this.props.strings.See_more}
                                </button>
                            }
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        )
    }
}

export default NotificationsSidebar