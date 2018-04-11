class Api::NotificationsController < ApplicationController
  def index
    page = params[:page] || 0
    @notifications = current_user.notifications.limit(12).offset(page * 12)
  end
end