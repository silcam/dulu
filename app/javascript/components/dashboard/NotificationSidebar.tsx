import React, { useState, useContext, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationsList from "./NotificationsList";
import styles from "./NotificationsList.css";
import { INotification } from "./Notification";
import update from "immutability-helper";
import DuluAxios from "../../util/DuluAxios";
import { ViewPrefs, UpdateViewPrefs } from "../../application/DuluApp";
import I18nContext from "../../application/I18nContext";

export enum Channel {
  forMe,
  all
}

interface IProps {
  viewPrefs: ViewPrefs;
  updateViewPrefs: UpdateViewPrefs;
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

export default function NotificationsSidebar(props: IProps) {
  const t = useContext(I18nContext);
  const channels = [Channel.forMe, Channel.all];
  const channelPaths = ["/api/notifications", "/api/notifications/global"];
  const channelNames = [t("For_me"), t("All")];
  const [state, setState] = useState<ChannelState[]>(
    channels.map(() => ({ notifications: [], nextPage: 0 }))
  );

  const setChannelState = (channel: Channel, mergeState: MergeChannelState) =>
    setState(update(state, {
      [channel]: { $merge: mergeState }
    }) as ChannelState[]);

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

  const markAllRead = (channel: Channel) => {
    const notifications = state[channel].notifications;
    DuluAxios.post(`${channelPaths[channel]}/mark_read`, {
      from: notifications[notifications.length - 1].id,
      to: notifications[0].id
    });
    setChannelState(channel, {
      notifications: notifications.map(n => {
        n.read = true;
        return n;
      })
    });
  };

  const currentChannel = props.viewPrefs.notificationsTab || 0;
  useEffect(() => {
    if (state[currentChannel].notifications.length == 0)
      getNotifications(currentChannel);
  }, [props.viewPrefs.notificationsTab]);

  return (
    <div className={styles.container}>
      <h3 style={{ marginTop: 0 }}>{t("Notifications")}</h3>
      <Tabs
        selectedIndex={currentChannel}
        onSelect={index => props.updateViewPrefs({ notificationsTab: index })}
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
