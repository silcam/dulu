class CreateBookTranslationStatuses < ActiveRecord::Migration[5.0]
  def change
    create_table :book_translation_statuses do |t|
      t.references :book_in_translation
      t.references :translation_stage
      t.date :start_date
      t.timestamps
    end

    remove_column :books_in_translation, :translation_stage_id, :integer
  end
end
