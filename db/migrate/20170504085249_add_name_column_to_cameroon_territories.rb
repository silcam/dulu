class AddNameColumnToCameroonTerritories < ActiveRecord::Migration[5.0]
  def change
    add_column :cameroon_territories, :name, :string
  end
end
