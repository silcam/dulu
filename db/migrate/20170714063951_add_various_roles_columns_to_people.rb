class AddVariousRolesColumnsToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :role_user, :boolean, default: false
    add_column :people, :role_program_responsable, :boolean, default: false
    add_column :people, :role_program_supervisor, :boolean, default: false
    add_column :people, :role_program_admin, :boolean, default: false
    add_column :people, :role_site_admin, :boolean, default: false
  end
end
