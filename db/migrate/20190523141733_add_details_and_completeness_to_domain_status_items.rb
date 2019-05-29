class AddDetailsAndCompletenessToDomainStatusItems < ActiveRecord::Migration[5.1]
  def change
    add_column :domain_status_items, :completeness, :string, default: ""
    add_column :domain_status_items, :details, :json, default: {}
  end
end
