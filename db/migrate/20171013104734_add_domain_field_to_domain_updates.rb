class AddDomainFieldToDomainUpdates < ActiveRecord::Migration[5.0]
  def change
    add_column :domain_updates, :domain, :string
  end
end
