class Language < ApplicationRecord
  belongs_to :language_status, required: false
  belongs_to :country, required: false
  belongs_to :cameroon_region, required: false

  has_one :program
end
