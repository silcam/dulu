class ChangeBookTranslationStagesToTranslationStages < ActiveRecord::Migration[5.0]
  def change
    rename_table :book_translation_stages, :translation_stages
    
  end
end
