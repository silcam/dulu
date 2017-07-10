class DropFmidColumns < ActiveRecord::Migration[5.0]
  def change
    remove_column :people, :fmid, :integer
    remove_column :organizations, :fmid, :integer
    remove_column :languages, :fmid, :integer
  end
end
