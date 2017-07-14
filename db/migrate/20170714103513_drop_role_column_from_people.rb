class DropRoleColumnFromPeople < ActiveRecord::Migration[5.0]
  def change
    remove_column :people, :role, :integer
  end
end
