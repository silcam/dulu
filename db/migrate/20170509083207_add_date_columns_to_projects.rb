class AddDateColumnsToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :start_date, :date
    add_column :projects, :finish_date, :date
    remove_column :projects, :is_active, :boolean
  end
end
