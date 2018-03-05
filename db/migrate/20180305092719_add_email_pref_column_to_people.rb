class AddEmailPrefColumnToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :email_pref, :integer, default: 0
  end
end
