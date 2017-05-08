class Country < ApplicationRecord
  has_many :languages

  def name
    #TODO - make this return the appropriate english or french name
    #depending on the UI Language set for current user
    self.english_name
  end

  def name=(name)
    self.english_name = name
  end

end
