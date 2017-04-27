class AddUserAccountFieldsToPeopleTable < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :email, :string
    add_column :people, :has_login, :boolean, default: false
    add_column :people, :password, :string
  end
end
