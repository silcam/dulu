class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.string :start_date
      t.string :end_date
      t.integer :kind
      t.string :name
      t.timestamps
    end

    create_table :events_programs do |t|
      t.references :event
      t.references :program
    end
  end
end
