# frozen_string_literal: true

class AddEventSelfAssociation < ActiveRecord::Migration[5.1]
  def change
    create_table :dockets do |t|
      t.belongs_to :series_event, class: 'Event'
      t.belongs_to :event
      t.timestamps
    end
  end
end
