class CleanUpUnusedColumnsAndTables < ActiveRecord::Migration[5.0]
  def change
    remove_column :event_participants, :program_role_id, :integer
    remove_column :participants, :program_role_id, :integer
    remove_column :people, :role_user, :boolean
    remove_column :people, :role_program_admin, :boolean
    remove_column :people, :role_program_responsable, :boolean
    remove_column :people, :role_program_supervisor, :boolean
    remove_column :people, :role_site_admin, :boolean
    remove_column :stages, :stage_name_id
    drop_table :program_roles do |t|
      t.string :name
      t.timestamps
    end
    drop_table :program_roles_stage_names do |t|
      t.integer "program_role_id"
      t.integer "stage_name_id"
    end
    drop_table :research_permits do |t|
      t.integer  "person_id"
      t.integer  "language_id"
      t.date     "proposal_date"
      t.date     "issue_date"
      t.date     "expiration_date"
      t.string   "permit_number"
      t.text     "description"
      t.timestamps
    end
    drop_table :stage_names do |t|
      t.string  "name"
      t.integer "level"
      t.string  "kind"
    end
  end
end
