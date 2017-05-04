class CameroonRegion < ApplicationRecord
  has_many :cameroon_territories
  has_many :languges
end
