class Person < ApplicationRecord

  belongs_to :organization

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false

end
