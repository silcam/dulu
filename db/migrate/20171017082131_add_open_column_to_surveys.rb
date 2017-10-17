class AddOpenColumnToSurveys < ActiveRecord::Migration[5.0]
  def change
    add_column :surveys, :open, :boolean, default: false
  end
end
