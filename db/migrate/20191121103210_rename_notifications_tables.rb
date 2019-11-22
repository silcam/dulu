class RenameNotificationsTables < ActiveRecord::Migration[5.1]
  def up
    rename_table :notifications, :old_notifications
    rename_table :text_notifications, :notifications
    rename_column :person_text_notifications, :text_notification_id, :notification_id
    rename_table :person_text_notifications, :person_notifications
  end

  def down
    rename_table :person_notifications, :person_text_notifications
    rename_column :person_text_notifications, :notification_id, :text_notification_id
    rename_table :notifications, :text_notifications
    rename_table :old_notifications, :notifications
  end
end
