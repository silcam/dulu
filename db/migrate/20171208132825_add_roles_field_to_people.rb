class AddRolesFieldToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :roles_field, :string
  end
end
