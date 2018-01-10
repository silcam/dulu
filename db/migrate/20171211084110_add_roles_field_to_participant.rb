class AddRolesFieldToParticipant < ActiveRecord::Migration[5.0]
  def change
    add_column :participants, :roles_field, :string
  end
end
