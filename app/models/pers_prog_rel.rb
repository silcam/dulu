class PersProgRel < ApplicationRecord
  belongs_to :person
  belongs_to :program
  belongs_to :program_role
  has_and_belongs_to_many :activities

  validates :start_date, presence: true, allow_blank: false
end
