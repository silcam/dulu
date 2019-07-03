class AddCategoriesToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :category, :string, default: ''
    add_column :events, :subcategory, :string, default: ''
  end
end
