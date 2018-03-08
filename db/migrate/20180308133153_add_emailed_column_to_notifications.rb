class AddEmailedColumnToNotifications < ActiveRecord::Migration[5.0]
  def change
    add_column :notifications, :emailed, :boolean, default: false
  end
end
