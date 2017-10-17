class Survey < ApplicationRecord
  has_and_belongs_to_many :programs
  has_and_belongs_to_many :status_parameters
  has_many :survey_completions, dependent: :destroy

  def display_name
    name + ' Survey'
  end

  def self.generate_end_a
    program_ids = [68]
    status_parameters = StatusParameter.where.not(id: [])

    Survey.find_by(name: '2017 End A').try(:destroy)
    survey = Survey.create!(name: '2017 End A', open: true)
    survey.programs = Program.where(id: program_ids)
    survey.status_parameters = status_parameters
    survey
  end
end
