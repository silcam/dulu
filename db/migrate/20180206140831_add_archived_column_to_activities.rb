class AddArchivedColumnToActivities < ActiveRecord::Migration[5.0]
  def change
    add_column :activities, :archived, :boolean, default: false
  end
end
