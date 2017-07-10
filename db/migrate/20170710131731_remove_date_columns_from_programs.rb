class RemoveDateColumnsFromPrograms < ActiveRecord::Migration[5.0]
  def change
    remove_column :programs, :start_date, :date
    remove_column :programs, :finish_date, :date
  end
end
