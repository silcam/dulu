class Country < ApplicationRecord
  has_many :languages

  def name
    I18n.locale==:fr ? french_name : english_name
  end

  def self.all_in_order
    if I18n.locale == :fr
      countries = Country.all
      return countries.sort_by { |c| I18n.transliterate(c.french_name) }
    end
    return Country.all.order :english_name
  end

end
