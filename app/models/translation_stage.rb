class TranslationStage < ApplicationRecord

  has_many :books_in_translation

  def self.add_stages_to_db
    ["Planned", "Drafting", "Testing", "Revising", "Back-Translating",
    "Consultant Check Needed", "Consultant Check in Progress", 
    "Consultant Checked", "Published"].each do |stage|
      TranslationStage.new({name: stage}).save
    end
  end
end
