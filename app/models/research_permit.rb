class ResearchPermit < ApplicationRecord

  belongs_to :person
  belongs_to :language
  
  validates :issue, presence: true
  validates :expiration, presence: true
end
