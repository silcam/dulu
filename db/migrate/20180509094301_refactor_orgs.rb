class RefactorOrgs < ActiveRecord::Migration[5.1]
  def change
    add_column :organizations, :parent_id, :integer
    add_reference :organizations, :country
    rename_column :organizations, :name, :long_name
    rename_column :organizations, :abbreviation, :short_name
  end
end
