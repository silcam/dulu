module HasTranslatedNames
  extend ActiveSupport::Concern

  def t_names
    return {
      en: self.english_name,
      fr: self.french_name
    }
  end
end