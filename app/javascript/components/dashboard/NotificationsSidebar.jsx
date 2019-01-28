import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationsList from "./NotificationsList";
import axios from "axios";
import styles from "./NotificationsList.css";

const paths = {
  forMe: "/api/notifications",
  all: "/api/notifications/global"
};

class NotificationsSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forMe: {
        notifications: [],
        nextPage: 0
      },
      all: {
        notifications: [],
        nextPage: 0
      }
    };
  }

  componentDidMount() {
    this.getNotifications("forMe");
    this.getNotifications("all");
  }

  getNotifications = channel => {
    this.setState(prevState => {
      const channelState = prevState[channel];
      channelState.loading = true;
      return {
        [channel]: channelState
      };
    });
    const channelState = this.state[channel];
    axios
      .get(`${paths[channel]}?page=${channelState.nextPage}`)
      .then(response => {
        this.setState(prevState => {
          const channelState = prevState[channel];
          return {
            [channel]: {
              notifications: channelState.notifications.concat(
                response.data.notifications
              ),
              unreadNotifications:
                channelState.unreadNotifications ||
                response.data.unreadNotifications,
              moreAvailable: response.data.moreAvailable,
              nextPage: channelState.nextPage + 1,
              loading: false
            }
          };
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  markAllRead = channel => {
    this.setState(prevState => {
      let channelState = prevState[channel];
      const notifications = channelState.notifications;
      axios
        .post(`${paths[channel]}/mark_read/`, {
          authenticity_token: this.props.authenticityToken,
          from: notifications[notifications.length - 1].id,
          to: notifications[0].id
        })
        .catch(error => {
          console.error(error);
        });
      let newNotifications = notifications.slice();
      for (let notification of newNotifications) {
        notification.read = true;
      }
      channelState.notifications = newNotifications;
      channelState.unreadNotifications = false;
      return {
        [channel]: channelState
      };
    });
  };

  render() {
    const t = this.props.t;
    return (
      <div id="notificationsSidebar">
        <h3 style={{ marginTop: 0 }}>{t("Notifications")}</h3>
        <Tabs>
          <TabList>
            <Tab>
              <span
                className={
                  this.state.forMe.unreadNotifications
                    ? styles.unreadNotification
                    : ""
                }
              >
                {t("For_me")}
              </span>
            </Tab>
            <Tab>{t("All")}</Tab>
          </TabList>
          <TabPanel>
            <NotificationsList
              channel="forMe"
              getNotifications={this.getNotifications}
              markAllRead={this.markAllRead}
              t={t}
              {...this.state.forMe}
            />
          </TabPanel>
          <TabPanel>
            <NotificationsList
              channel="all"
              getNotifications={this.getNotifications}
              markAllRead={this.markAllRead}
              t={t}
              {...this.state.all}
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default NotificationsSidebar;
