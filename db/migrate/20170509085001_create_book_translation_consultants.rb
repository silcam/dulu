class CreateBookTranslationConsultants < ActiveRecord::Migration[5.0]
  def change
    create_table :book_translation_consultants do |t|
      t.references :book_in_translation
      t.references :person
      t.date :start_date
      t.date :end_date

      t.timestamps
    end

    remove_column :books_in_translation, :linguist_id, :integer
  end
end
