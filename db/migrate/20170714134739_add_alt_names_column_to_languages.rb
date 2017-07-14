class AddAltNamesColumnToLanguages < ActiveRecord::Migration[5.0]
  def change
    add_column :languages, :alt_names, :string
  end
end
