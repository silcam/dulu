class LinguisticActivity < Activity

  CATEGORIES = %i( Grammar Dictionary Phonology Other )

  validates :title, presence: true, allow_blank: false
  validates :category, inclusion: CATEGORIES

  def category
    self.attributes['category'].try(:to_sym)
  end

  def name
    "#{title} - #{I18n.t(category)}"
  end

  def self.stages
    Stage.stages(:Linguistic)
  end

  def self.build(params, program, participants)
    la_params = params.permit(:category, :title).merge(program: program, participants: participants)
    LinguisticActivity.create(la_params)
  end

  def self.search(query)
    activities = LinguisticActivity.where("title ILIKE :q OR category ILIKE :q", {q: "%#{query}%"})
    results = []
    activities.each do |activity|
      results << {
          title: activity.name,
          description: "#{activity.program.name} - #{activity.current_stage.name}",
          route: "/activities/#{activity.id}"}
    end
    results
  end

end