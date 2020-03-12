# frozen_string_literal: true

class CreateNotes < ActiveRecord::Migration[5.1]
  def change
    create_table :notes do |t|
      t.references :person
      t.string :text
      t.string :for_type
      t.integer :for_id
      
      t.timestamps
    end
  end
end
