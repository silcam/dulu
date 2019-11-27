class Region < ApplicationRecord
  belongs_to :lpf, required: false, class_name: 'Person'
  has_many :clusters, dependent: :nullify
  has_many :languages, dependent: :nullify

  default_scope { order :name }

  validates :name, presence: true, allow_blank: false
end
