class CreateWorkshops < ActiveRecord::Migration[5.0]
  def change
    create_table :workshops do |t|
      t.integer :number
      t.string :name
      t.references :linguistic_activity
      t.timestamps
    end
  end
end
