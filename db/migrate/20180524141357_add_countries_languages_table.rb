class AddCountriesLanguagesTable < ActiveRecord::Migration[5.1]
  def change
    create_table :countries_languages do |t|
      t.references :country
      t.references :language
    end
  end
end
