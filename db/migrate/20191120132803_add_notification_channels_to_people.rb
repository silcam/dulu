class AddNotificationChannelsToPeople < ActiveRecord::Migration[5.1]
  def change
    add_column :people, :notification_channels, :string, default: ""
  end
end
