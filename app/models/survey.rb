class Survey < ApplicationRecord

  has_and_belongs_to_many :status_parameters
  has_many :survey_completions, dependent: :destroy

  def display_name
    name + ' Survey'
  end

  def self.generate_end_a
    status_parameters = StatusParameter.where.not(id: [12, 13, 14])

    Survey.find_by(name: '2017 End A').try(:destroy)
    survey = Survey.create!(name: '2017 End A', open: true)
    survey.status_parameters = status_parameters
    survey
  end
end
