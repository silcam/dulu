class AddRoleColumnToPerson < ActiveRecord::Migration[5.0]
  def up
    add_column :people, :role, :integer, default: 0

    Person.all.each do |person|
      person.update(role: 1) if person.has_login
    end
  end

  def down
    remove_column :people, :role
  end
end
