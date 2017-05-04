class CreateCameroonTerritories < ActiveRecord::Migration[5.0]
  def change
    create_table :cameroon_territories do |t|
      t.belongs_to :cameroon_region
      #t.name

      t.timestamps
    end
  end
end
