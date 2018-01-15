class LinguisticActivity < Activity

  CATEGORIES = %i( Grammar Dictionary Phonology Other )

  validates :title, presence: true, allow_blank: false
  validates :category, inclusion: CATEGORIES

  def category
    self.attributes['category'].try(:to_sym)
  end

  def name
    title
  end

  def self.stages
    Stage.stages(:Linguistic)
  end

  def self.build(params, program, participants)
    la_params = params.permit(:category, :title).merge(program: program, participants: participants)
    LinguisticActivity.create(la_params)
  end

  def self.search(query)
    []
  end

end