# frozen_string_literal: true

class Api::NotificationsController < ApplicationController
  def index
    @p_notifications, @more_available = get_paged(current_user.person_notifications)
  end

  def global
    @notifications, @more_available = get_paged(
      params[:channels] ? Notification.for_channels(params[:channels]) : Notification
    )
  end

  def mark_read
    current_user.person_notifications.where(id: (params[:from]..params[:to])).update(read: true)
  end

  private

  def get_paged(source)
    page = params[:page].to_i || 0
    page_size = 12
    items = source.offset(page * page_size).limit(page_size + 1).to_a
    if items.size == page_size + 1
      items.pop
      more_available = true
    else
      more_available = false
    end
    [items, more_available]
  end
end
