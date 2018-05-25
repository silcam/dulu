class AddViewPrefsColumnToPeople < ActiveRecord::Migration[5.1]
  def change
    add_column :people, :view_prefs, :json, default: {}
  end
end
