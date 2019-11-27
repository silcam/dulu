# frozen_string_literal: true

class CountryRegion < ApplicationRecord
  belongs_to :country, required: true
  has_many :territories
  has_and_belongs_to_many :languages

  def name
    I18n.locale == :fr ? french_name : english_name
  end
end
