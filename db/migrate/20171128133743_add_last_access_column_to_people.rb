class AddLastAccessColumnToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :last_access, :date
  end
end
