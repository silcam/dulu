class ChangeTranslationActivityIdsToActivityIds < ActiveRecord::Migration[5.0]
  def change
    rename_column :book_translation_consultants, :translation_activity_id, :activity_id
    rename_column :translation_stages, :translation_activity_id, :activity_id
  end
end
