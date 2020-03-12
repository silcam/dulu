# frozen_string_literal: true

class CreateDsiLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :dsi_locations do |t|
      t.string :name
      t.timestamps
    end
  end
end
