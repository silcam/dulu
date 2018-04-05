class Lpf < ApplicationRecord
  belongs_to :person, required: false
  has_many :clusters
  has_many :programs

  default_scope { order :name }

  validates :name, presence: true, allow_blank: false
end
