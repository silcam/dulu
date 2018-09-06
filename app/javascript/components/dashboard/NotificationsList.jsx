import axios from "axios";
import React from "react";

/**
 * Inserts variable strings into a translated string
 * @param {string} message
 * @param {object} vars
 * @param {object} links
 */
function t_sub(message, vars, links) {
  let newMessage = message;
  for (let v in vars) {
    let searchStr = "%{" + v + "}";
    let replacement = links[v]
      ? `<a href="${links[v]}">${vars[v]}</a>`
      : vars[v];
    newMessage = newMessage.replace(searchStr, replacement);
  }
  return newMessage;
}

class NotificationsList extends React.PureComponent {
  clickSeeMore = e => {
    this.props.getNotifications(this.props.channel);
    e.target.blur();
  };

  markAllRead = () => {
    this.props.markAllRead(this.props.channel);
  };

  render() {
    const t = this.props.t;
    return (
      <div>
        {this.props.unreadNotifications && (
          <button className="btn-link" onClick={this.markAllRead}>
            {this.props.t("Mark_all_read")}
          </button>
        )}
        <table className="table">
          <tbody>
            {this.props.notifications.map(notification => {
              return (
                <tr key={notification.id}>
                  <td>
                    <span className="notificationDate">
                      {notification.created_at.slice(0, 10)}
                    </span>
                    <br />
                    <span
                      className={notification.read ? "" : "unreadNotification"}
                      dangerouslySetInnerHTML={{
                        __html: t_sub(
                          t(notification.message.key),
                          notification.message.t_vars,
                          notification.message.links
                        )
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                {this.props.loading && <p>{t("Loading")}</p>}
                {this.props.moreAvailable &&
                  !this.props.loading && (
                    <button
                      className="btn-link"
                      onClick={this.clickSeeMore}
                      style={{ padding: 0 }}
                    >
                      {this.props.t("See_more")}
                    </button>
                  )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default NotificationsList;
