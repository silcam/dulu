class ReworkRegionsAndTerritories < ActiveRecord::Migration[5.0]
  def up
    rename_table :cameroon_regions, :regions
    rename_table :cameroon_territories, :territories
    rename_column :territories, :cameroon_region_id, :region_id
    rename_column :languages, :cameroon_region_id, :region_id
    cameroon_id = Country.find_by_english_name 'Cameroon'
    add_reference :regions, :country, default: cameroon_id
  end

  def down
    rename_table :regions, :cameroon_regions
    rename_table :territories, :cameroon_territories
    rename_column :cameroon_territories, :region_id, :cameroon_region_id
    rename_column :languages, :region_id, :cameroon_region_id
    remove_reference :cameroon_regions, :country
  end
end
