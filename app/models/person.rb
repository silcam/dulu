class Person < ApplicationRecord
  #has_one :user
  validates :last_name, presence: true, length: { minimum: 1} #TODO: better name validation - use .blank?
  validates :first_name, presence: true, length: { minimum: 1}

end
