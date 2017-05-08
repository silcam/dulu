class CreateBibleBooks < ActiveRecord::Migration[5.0]
  def change
    create_table :bible_books do |t|
      t.string :name
      t.integer :number_of_chapters
      t.integer :number_of_verses
      
    end
  end
end
