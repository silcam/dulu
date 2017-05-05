class Person < ApplicationRecord

  belongs_to :organization, required: false
  belongs_to :country

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :fmid, uniqueness: true, allow_blank: true
  validates :gender, inclusion: { in: %w(M F)}

end
