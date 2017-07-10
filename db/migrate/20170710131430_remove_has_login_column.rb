class RemoveHasLoginColumn < ActiveRecord::Migration[5.0]
  def change
    remove_column :people, :has_login, :boolean
  end
end
