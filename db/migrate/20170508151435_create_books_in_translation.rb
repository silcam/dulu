class CreateBooksInTranslation < ActiveRecord::Migration[5.0]
  def change
    create_table :books_in_translation do |t|
      t.references :project
      t.references :bible_book
      t.references :translation_stage
      t.integer :linguist_id

      t.timestamps
    end
  end
end
