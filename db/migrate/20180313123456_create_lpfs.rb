class CreateLpfs < ActiveRecord::Migration[5.0]
  def change
    create_table :lpfs do |t|
      t.string :name
      t.references :person

      t.timestamps
    end
  end
end
