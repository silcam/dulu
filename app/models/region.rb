class Region < ApplicationRecord
  belongs_to :country, required: true
  has_many :territories
  has_many :languages

  def name
    if I18n.locale == :fr
      return french_name
    end
    return english_name
  end
end
