class AddRolesFieldColumnToEventParticipants < ActiveRecord::Migration[5.0]
  def change
    add_column :event_participants, :roles_field, :string
  end
end
