class SurveyCompletion < ApplicationRecord
  belongs_to :survey
  belongs_to :language
  belongs_to :person
end
