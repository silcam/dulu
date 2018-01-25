class CreateActivitiesBibleBooksJoinTable < ActiveRecord::Migration[5.0]
  def change
    create_table :activities_bible_books do |t|
      t.references :media_activity
      t.references :bible_book
    end
  end
end
