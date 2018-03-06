class CreateLanguages < ActiveRecord::Migration[5.0]
  def change
    create_table :languages do |t|
      t.string :name
      t.integer :fmid
      t.string :category
      t.string :code
      t.belongs_to :language_status
      t.text :notes
      t.belongs_to :country
      t.string :international_language
      t.integer :population
      t.string :population_description
      t.string :classification
      t.belongs_to :region
      
      t.timestamps
    end
  end
end
