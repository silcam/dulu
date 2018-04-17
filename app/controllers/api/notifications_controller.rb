class Api::NotificationsController < ApplicationController
  def index
    page = params[:page].to_i || 0
    page_size = 12
    @notifications = current_user.notifications.offset(page * page_size).limit(page_size+1).to_a
    if @notifications.size == page_size + 1
      @notifications.pop
      @more_available = true
    else
      @more_available = false
    end
  end

  def mark_read
    current_user.notifications.where(id: (params[:from]..params[:to])).update(read: true)
  end
end