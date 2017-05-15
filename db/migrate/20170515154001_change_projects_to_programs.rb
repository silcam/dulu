class ChangeProjectsToPrograms < ActiveRecord::Migration[5.0]
  def change
    rename_table :projects, :programs
    rename_column :books_in_translation, :project_id, :program_id
    
  end
end
