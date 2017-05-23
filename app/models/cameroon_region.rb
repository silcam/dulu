class CameroonRegion < ApplicationRecord
  has_many :cameroon_territories
  has_many :languges

  def name
    if I18n.locale == :fr
      return french_name
    end
    return english_name
  end
end
