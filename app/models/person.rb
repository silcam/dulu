class Person < ApplicationRecord

  belongs_to :organization, required: false

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :fmid, uniqueness: true

end
