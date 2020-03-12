# frozen_string_literal: true

class CreateEventLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :event_locations do |t|
      t.string :name
      t.timestamps
    end

    add_reference :events, :event_location
  end
end
