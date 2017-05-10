class BookTranslationStatus < ApplicationRecord

  belongs_to :book_in_translation
  belongs_to :translation_stage
  
  def self.default_new_params
    {translation_stage_id: TranslationStage.first.id,
      start_date: Date.today}
  end
end
