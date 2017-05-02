class AddFmidColumntoPeopleAndOrganizations < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :fmid, :integer
    add_column :organizations, :fmid, :integer
  end
end
