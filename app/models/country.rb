class Country < ApplicationRecord
  has_many :languages
  has_many :people
  has_many :regions

  def name
    I18n.locale==:fr ? french_name : english_name
  end

  def french_name_transliterated
    I18n.transliterate(french_name)
  end

  def self.all_in_order
    if I18n.locale == :fr
      countries = Country.all
      return countries.sort do |a, b|
        if a.people_count == b.people_count
          a.french_name_transliterated <=> b.french_name_transliterated
        else
          b.people_count <=> a.people_count
        end
      end
    end
    return Country.all.order(people_count: :desc, english_name: :asc)
  end

  def self.search(query)
    field = (I18n.locale == :fr) ? 'french_name' : 'english_name'
    Country.where("unaccent(#{field}) ILIKE unaccent(?)", "#{query}%")
            .order(field)
  end
end
