# frozen_string_literal: true

class AddLocationAndLinkToDsIs < ActiveRecord::Migration[5.1]
  def change
    add_column :domain_status_items, :link, :string, default: ''
    add_reference :domain_status_items, :dsi_location
  end
end
