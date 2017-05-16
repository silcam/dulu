class BookTranslationStage < ApplicationRecord

  belongs_to :book_in_translation
  belongs_to :stage_name
  
  def self.default_new_params
    {stage_name_id: StageName.first.id,
      start_date: Date.today}
  end

  def self.new_for book_in_translation
    existing = book_in_translation.current_translation_stage
    BookTranslationStage.new({
      stage_name: existing.stage_name.next_stage,
      start_date: Date.today})
  end
end
