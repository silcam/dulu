# frozen_string_literal: true

json.notifications @p_notifications do |p_notification|
  json.call(p_notification.notification, :id, :text)

  json.person_notification do
    json.id p_notification.id
    json.read p_notification.read
  end
end

json.moreAvailable @more_available
json.unreadNotifications @p_notifications.any?(&:unread)
