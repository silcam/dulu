class Lpf < ApplicationRecord
  belongs_to :person, required: false
  has_many :clusters, dependent: :nullify
  has_many :languages, dependent: :nullify

  default_scope { order :name }

  validates :name, presence: true, allow_blank: false
end
