class CreateEventParticipants < ActiveRecord::Migration[5.0]
  def change
    create_table :event_participants do |t|
      t.references :event
      t.references :person
      t.references :program_role

      t.timestamps
    end
  end
end
