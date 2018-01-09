class AddNameToStages < ActiveRecord::Migration[5.0]
  def change
    add_column :stages, :name, :string
    add_column :stages, :kind, :string
  end
end
