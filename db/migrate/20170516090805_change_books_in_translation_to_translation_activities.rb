class ChangeBooksInTranslationToTranslationActivities < ActiveRecord::Migration[5.0]
  def change
    rename_table :books_in_translation, :translation_activities
    rename_column :book_translation_consultants, :book_in_translation_id, :translation_activity_id
    rename_column :translation_stages, :book_in_translation_id, :translation_activity_id
  end
end
