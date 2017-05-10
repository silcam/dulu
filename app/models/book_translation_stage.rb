class BookTranslationStage < ApplicationRecord

  belongs_to :book_in_translation
  belongs_to :translation_stage
  
  def self.default_new_params
    {translation_stage_id: TranslationStage.first.id,
      start_date: Date.today}
  end

  def self.new_for book_in_translation
    existing = book_in_translation.current_translation_stage
    BookTranslationStage.new({
      translation_stage: existing.translation_stage.next_stage,
      start_date: Date.today})
  end
end
