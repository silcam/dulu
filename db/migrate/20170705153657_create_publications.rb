class CreatePublications < ActiveRecord::Migration[5.0]
  def change
    create_table :publications do |t|
      t.references :program
      t.string :kind
      t.string :english_name
      t.string :french_name
      t.string :nl_name
      t.integer :year

      t.timestamps
    end
  end
end
