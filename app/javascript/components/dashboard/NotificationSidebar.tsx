import React, { useState, useContext, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationsList from "../notifications/NotificationsList";
import styles from "../notifications/NotificationsList.css";
import { INotification } from "../notifications/Notification";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
import I18nContext from "../../contexts/I18nContext";
import ViewPrefsContext from "../../contexts/ViewPrefsContext";

export enum Channel {
  forMe,
  all
}

interface MergeChannelState {
  notifications?: INotification[];
  nextPage?: number;
  loading?: boolean;
  unreadNotifications?: boolean;
  moreAvailable?: boolean;
}

interface ChannelState {
  notifications: INotification[];
  nextPage: number;
  loading?: boolean;
  unreadNotifications?: boolean;
  moreAvailable?: boolean;
}

export default function NotificationsSidebar() {
  const t = useContext(I18nContext);
  const { viewPrefs, updateViewPrefs } = useContext(ViewPrefsContext);
  const channels = [Channel.forMe, Channel.all];
  const channelPaths = ["/api/notifications", "/api/notifications/global"];
  const channelNames = [t("For_me"), t("All")];
  const [state, setState] = useState<ChannelState[]>(
    channels.map(() => ({ notifications: [], nextPage: 0 }))
  );

  const setChannelState = (channel: Channel, mergeState: MergeChannelState) =>
    setState(
      update(state, {
        [channel]: { $merge: mergeState }
      }) as ChannelState[]
    );

  const getNotifications = async (channel: Channel) => {
    setChannelState(channel, { loading: true });
    const data = await DuluAxios.get(channelPaths[channel], {
      page: state[channel].nextPage
    });
    if (data) {
      setChannelState(channel, {
        notifications: state[channel].notifications.concat(data.notifications),
        unreadNotifications:
          state[channel].unreadNotifications || data.unreadNotifications,
        moreAvailable: data.moreAvailable,
        nextPage: state[channel].nextPage + 1,
        loading: false
      });
    } else {
      setChannelState(channel, { loading: false });
    }
  };

  const markAllRead = () => {
    const notifications = state[Channel.forMe].notifications;
    const p_notifications = notifications
      .map(n => n.person_notification)
      .filter(pn => pn);
    DuluAxios.post(`/api/notifications/mark_read`, {
      from: p_notifications[p_notifications.length - 1]!.id,
      to: p_notifications[0]!.id
    });
    setChannelState(Channel.forMe, {
      notifications: notifications.map(n => {
        if (n.person_notification) n.person_notification.read = true;
        return n;
      })
    });
  };

  const currentChannel = viewPrefs.notificationsTab || 0;
  useEffect(() => {
    if (state[currentChannel].notifications.length == 0)
      getNotifications(currentChannel);
  }, [viewPrefs.notificationsTab]);

  return (
    <div className={styles.container}>
      <h3 style={{ marginTop: 0 }}>{t("Notifications")}</h3>
      <Tabs
        selectedIndex={currentChannel}
        onSelect={index => updateViewPrefs({ notificationsTab: index })}
      >
        <TabList>
          {state.map((channelState, channel) => (
            <Tab key={channel}>
              <span
                className={
                  channelState.unreadNotifications
                    ? styles.unreadNotification
                    : ""
                }
              >
                {channelNames[channel]}
              </span>
            </Tab>
          ))}
        </TabList>
        {state.map((channelState, channel) => (
          <TabPanel key={channel}>
            <NotificationsList
              channel={channel}
              getNotifications={getNotifications}
              markAllRead={markAllRead}
              {...channelState}
            />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
