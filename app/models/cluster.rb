class Cluster < ApplicationRecord
  has_many :languages

  validates :name, presence: true

  default_scope { order(:name) }
end
