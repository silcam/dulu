class SurveyCompletion < ApplicationRecord
  belongs_to :survey
  belongs_to :program
  belongs_to :person
end
