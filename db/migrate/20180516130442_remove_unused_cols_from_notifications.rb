class RemoveUnusedColsFromNotifications < ActiveRecord::Migration[5.1]
  def change
    remove_column :notifications, :details_json, :json
    remove_column :notifications, :link, :string
    remove_column :notifications, :assoc_class, :string
    remove_column :notifications, :assoc_model_id, :integer
  end
end
