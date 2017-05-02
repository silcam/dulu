class CreateCountries < ActiveRecord::Migration[5.0]
  def change
    create_table :countries do |t|
      t.string :code
      t.string :english_name
      t.string :french_name

      t.timestamps
    end
  end
end
