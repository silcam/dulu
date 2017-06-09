class TranslationStage < ApplicationRecord

  belongs_to :activity
  belongs_to :stage_name
  has_many :program_roles, through: :stage_name

  validates :start_date, presence: true, allow_blank: false
  
  def self.default_new_params
    {stage_name: StageName.first_translation_stage,
      start_date: Date.today}
  end

  def self.new_for translation_activity
    existing = translation_activity.current_translation_stage
    TranslationStage.new({
      stage_name: existing.stage_name.next_stage,
      start_date: Date.today})
  end

  def progress
    self.stage_name.progress
  end
  
  def name
    self.stage_name.name
  end
end
