class AddCurrentColumnToStage < ActiveRecord::Migration[5.0]
  def change
    add_column :stages, :current, :boolean, default: false
  end
end
