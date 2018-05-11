class CreateOrganizationPeople < ActiveRecord::Migration[5.1]
  def change
    create_table :organization_people do |t|
      t.references :organization
      t.references :person
      t.string :position
      t.string :start_date
      t.string :end_date
      t.timestamps
    end
  end
end
