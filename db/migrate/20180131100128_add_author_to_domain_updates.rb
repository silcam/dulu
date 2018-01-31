class AddAuthorToDomainUpdates < ActiveRecord::Migration[5.0]
  def change
    add_column :domain_updates, :author_id, :integer
  end
end
