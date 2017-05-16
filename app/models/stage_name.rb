class StageName < ApplicationRecord

  has_many :translation_stages

  FIRST_STAGE = 1
  LAST_TRANSLATION_STAGE = 9

  #Only used for initializing database
  # def self.add_stages_to_db
  #   ["Planned", "Drafting", "Testing", "Revising", "Back-Translating",
  #   "Consultant Check Needed", "Consultant Check in Progress", 
  #   "Consultant Checked", "Published"].each do |stage|
  #     StageName.new({name: stage}).save
  #   end
  # end

  def next_stage
    if ( FIRST_STAGE .. (LAST_TRANSLATION_STAGE-1) ) === self.level
      return StageName.find_by(level: self.level + 1)
    end
    return self
  end

  def self.first_translation_stage
    return StageName.find_by(level: FIRST_STAGE, kind: 'Translation')
  end
end
