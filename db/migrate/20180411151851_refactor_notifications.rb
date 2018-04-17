class RefactorNotifications < ActiveRecord::Migration[5.1]
  def change
    add_column :notifications, :vars_json, :json
    add_column :notifications, :links_json, :json
  end
end
