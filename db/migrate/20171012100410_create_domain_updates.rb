class CreateDomainUpdates < ActiveRecord::Migration[5.0]
  def change
    create_table :domain_updates do |t|
      t.references :program
      t.references :status_parameter
      t.float :number
      t.string :status
      t.text :note
      t.string :date
      t.timestamps
    end
  end
end
