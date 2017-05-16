class TranslationStage < ApplicationRecord

  belongs_to :translation_activity
  belongs_to :stage_name
  
  def self.default_new_params
    {stage_name_id: StageName.first.id,
      start_date: Date.today}
  end

  def self.new_for translation_activity
    existing = translation_activity.current_translation_stage
    TranslationStage.new({
      stage_name: existing.stage_name.next_stage,
      start_date: Date.today})
  end
end
