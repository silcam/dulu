import React from "react";
import styles from "./NotificationsList.css";
import Notification from "./Notification";
import PropTypes from "prop-types";
import Loading from "../shared/Loading";

export default class NotificationsList extends React.PureComponent {
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
          <button className="link" onClick={this.markAllRead}>
            {this.props.t("Mark_all_read")}
          </button>
        )}
        <table className={styles.notificationsList}>
          <tbody>
            {this.props.notifications.map(notification => {
              return (
                <Notification
                  key={notification.id}
                  notification={notification}
                  t={t}
                />
              );
            })}
            <tr>
              <td>
                {this.props.loading && <Loading t={t} />}
                {this.props.moreAvailable && !this.props.loading && (
                  <button
                    className="link"
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

NotificationsList.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  markAllRead: PropTypes.func.isRequired,
  channel: PropTypes.string.isRequired,
  unreadNotifications: PropTypes.bool,
  notifications: PropTypes.array,
  loading: PropTypes.bool,
  moreAvailable: PropTypes.bool
};
