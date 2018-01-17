class AddFilmColumnToActivities < ActiveRecord::Migration[5.0]
  def change
    add_column :activities, :film, :string
  end
end
