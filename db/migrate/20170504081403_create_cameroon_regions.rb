class CreateCameroonRegions < ActiveRecord::Migration[5.0]
  def change
    create_table :cameroon_regions do |t|
      t.string :english_name
      t.string :french_name
      
      t.timestamps
    end
  end
end
