class AddActivityColumnsForLinguisticAndMedia < ActiveRecord::Migration[5.0]
  def change
    add_column :activities, :category, :string
    add_column :activities, :title, :string
    add_column :activities, :scripture, :string
  end
end
