class CameroonRegion < ApplicationRecord
  has_many :cameroon_territories
  has_many :languges

  def name
    #TODO: I18N of Cameroon Region Name
    self.english_name
  end
end
