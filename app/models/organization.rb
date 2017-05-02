class Organization < ApplicationRecord

  has_many :people

  validates :name, presence: true, allow_blank: false, uniqueness: true
end
