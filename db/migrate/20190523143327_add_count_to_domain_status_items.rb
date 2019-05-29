class AddCountToDomainStatusItems < ActiveRecord::Migration[5.1]
  def change
    add_column :domain_status_items, :count, :integer, default: 0
  end
end
