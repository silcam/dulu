class AddNoteFieldToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :note, :text
  end
end
