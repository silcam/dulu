class AddAuthorToReports < ActiveRecord::Migration[5.1]
  def change
    add_column :reports, :author_id, :integer
  end
end
