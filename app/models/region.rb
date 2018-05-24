class Region < ApplicationRecord
  belongs_to :country, required: true
  has_many :territories
  has_and_belongs_to_many :languages

  def name
    if I18n.locale == :fr
      return french_name
    end
    return english_name
  end
end
