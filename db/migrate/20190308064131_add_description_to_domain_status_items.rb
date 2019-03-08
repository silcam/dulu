class AddDescriptionToDomainStatusItems < ActiveRecord::Migration[5.1]
  def change
    add_column :domain_status_items, :description, :string, default: ""
    # The change is just to set the default empty string
    change_column :domain_status_items, :platforms, :string, default: ""
  end
end
