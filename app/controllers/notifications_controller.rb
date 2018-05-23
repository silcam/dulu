class NotificationsController < ApplicationController
  def mark_read
    current_user.notifications.where(read: false).update(read: true)
  end

  def index
    @notifications = Notification.where.not(person: nil).includes(:person).page(params[:page])
  end
end
