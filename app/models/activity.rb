class Activity < ApplicationRecord

  belongs_to :program
  has_many :translation_stages
end
