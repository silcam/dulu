# frozen_string_literal: true

class AddChannelsFieldToNotifications < ActiveRecord::Migration[5.1]
  def change
    add_column :notifications, :channels, :string, default: ''
  end
end
