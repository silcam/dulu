class AddLanguagesRegionsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :languages_regions do |t|
      t.references :language
      t.references :region
    end
  end
end
