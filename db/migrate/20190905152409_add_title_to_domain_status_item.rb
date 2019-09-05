class AddTitleToDomainStatusItem < ActiveRecord::Migration[5.1]
  def change
    add_column :domain_status_items, :title, :string, default: ''
  end
end
