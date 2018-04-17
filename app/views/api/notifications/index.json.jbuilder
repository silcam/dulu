unread_notifications = false
json.notifications @notifications do |notification|
  json.(notification, :id, :read)

  json.message do
    json.key notification.kind
    json.t_vars notification.t_vars
    json.links notification.links
  end

  unread_notifications = true unless notification.read
end

json.moreAvailable @more_available
json.unreadNotifications unread_notifications