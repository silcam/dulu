class AddColumnOrganizationIdToPeopleTable < ActiveRecord::Migration[5.0]
  def change
    add_reference :people, :organization, foreign_key: true 
  end
end
