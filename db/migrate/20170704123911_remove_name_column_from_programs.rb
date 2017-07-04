class RemoveNameColumnFromPrograms < ActiveRecord::Migration[5.0]
  def change
    remove_column :programs, :name, :string
  end
end
