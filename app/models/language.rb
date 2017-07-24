class Language < ApplicationRecord
  belongs_to :language_status, required: false
  belongs_to :country, required: false
  belongs_to :cameroon_region, required: false

  has_one :program

  def ethnologue_link
    return "https://www.ethnologue.com/language/#{code}"
  end

  def alt_names_array
    alt_names.split(', ')
  end

  def update_name(new_name)
    update_alt_names(new_name)
    self.name = new_name
    self.save
  end

  def update_alt_names(new_name)
    new_alt_names = alt_names_array
    new_alt_names.delete(new_name)
    new_alt_names.append(name).sort!
    self.alt_names = new_alt_names.join(', ')
  end
end
