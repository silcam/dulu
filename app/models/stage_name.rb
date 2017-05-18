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

  def progress
    case self.level
    when 1, 2
      return 0
    when 3
      return 20
    when 4
      return 40
    when 5
      return 60
    when 6, 7
      return 75
    when 8
      return 95
    end
    return 100
  end

end
