# frozen_string_literal: true

class RenameRegionsAndLpfs < ActiveRecord::Migration[5.1]
  def up
    rename_table :regions, :country_regions
    rename_table :languages_regions, :country_regions_languages
    rename_table :lpfs, :regions

    rename_column :country_regions_languages, :region_id, :country_region_id
    rename_column :languages, :region_id, :country_region_id
    rename_column :territories, :region_id, :country_region_id
    rename_column :clusters, :lpf_id, :region_id
    rename_column :languages, :lpf_id, :region_id

    rename_column :regions, :person_id, :lpf_id
  end

  def down
    rename_table :regions, :lpfs
    rename_table :country_regions_languages, :languages_regions
    rename_table :country_regions, :regions

    rename_column :languages_regions, :country_region_id, :region_id
    rename_column :languages, :region_id, :lpf_id
    rename_column :languages, :country_region_id, :region_id
    rename_column :territories, :country_region_id, :region_id
    rename_column :clusters, :region_id, :lpf_id

    rename_column :lpfs, :lpf_id, :person_id
  end
end
