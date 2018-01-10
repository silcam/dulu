class CreatePersonRoles < ActiveRecord::Migration[5.0]
  def change
    create_table :person_roles do |t|
      t.references :person
      t.string :role
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
