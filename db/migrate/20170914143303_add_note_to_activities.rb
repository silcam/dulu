class AddNoteToActivities < ActiveRecord::Migration[5.0]
  def change
    add_column :activities, :note, :text
  end
end
