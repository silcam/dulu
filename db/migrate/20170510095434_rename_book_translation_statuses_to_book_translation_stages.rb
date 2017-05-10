class RenameBookTranslationStatusesToBookTranslationStages < ActiveRecord::Migration[5.0]
  def change
    rename_table :book_translation_statuses, :book_translation_stages
  end
end
