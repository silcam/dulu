class Person < ApplicationRecord
  #has_one :user
  belongs_to :organization

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false

end
