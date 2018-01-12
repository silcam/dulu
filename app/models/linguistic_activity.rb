class LinguisticActivity < Activity

  CATEGORIES = %i( Grammar Dictionary Phonology Other )

  validates :title, presence: true, allow_blank: false
  validates :category, inclusion: CATEGORIES

  def self.search(query)
    []
  end

end