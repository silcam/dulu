class Country < ApplicationRecord
  has_many :languages

  def name
    if I18n.locale == :fr
      return self.french_name
    end
    self.english_name
  end

end
