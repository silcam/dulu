# frozen_string_literal: true

class AddTagsToEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :tags do |t|
      t.string :tagname
      
      t.timestamps
    end

    create_table :events_tags, id: false do |t|
      t.belongs_to :event
      t.belongs_to :tag
    end
  end
end
