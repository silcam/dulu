class RenamePersProgRelToParticipant < ActiveRecord::Migration[5.0]
  def change
    rename_table :pers_prog_rels, :participants
    rename_table :activities_pers_prog_rels, :activities_participants
    rename_column :activities_participants, :pers_prog_rel_id, :participant_id
  end
end
