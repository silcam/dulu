class CreatePersProgRels < ActiveRecord::Migration[5.0]
  def change
    create_table :pers_prog_rels do |t|
      t.references :person
      t.references :program
      t.references :program_role
      t.string :start_date
      t.string :end_date
      t.timestamps
    end

    create_table :activities_pers_prog_rels do |t|
      t.references :activity
      t.references :pers_prog_rel
    end
  end
end
