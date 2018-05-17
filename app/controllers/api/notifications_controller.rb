class Api::NotificationsController < ApplicationController
  def index
    get_notifications(current_user.notifications)
  end

  def global
    get_notifications(Notification.global)
    render :index
  end

  def mark_read
    current_user.notifications.where(id: (params[:from]..params[:to])).update(read: true)
  end

  private

  def get_notifications(source)
    page = params[:page].to_i || 0
    page_size = 12
    @notifications = source.offset(page * page_size).limit(page_size+1).to_a
    if @notifications.size == page_size + 1
      @notifications.pop
      @more_available = true
    else
      @more_available = false
    end
  end
end