class NotificationsController < ApplicationController
  def mark_read
    current_user.notifications.where(read: false).update(read: true)
  end

  def index
    @notifications = Notification.all.includes(:person).page(params[:page])
  end
end
