class MediaActivity < Activity
  has_and_belongs_to_many :bible_books

  CATEGORIES = %i( AudioScripture Film )
  SCRIPTURE = %i( Bible Old_testament New_testament Other )

  validates :category, inclusion: CATEGORIES
  validates :scripture, inclusion: SCRIPTURE, allow_nil: true

  default_scope { where(archived: false) }

  def category
    attributes["category"].try(:to_sym)
  end

  def film
    attributes["film"].try(:to_sym)
  end

  def scripture
    attributes["scripture"].try(:to_sym)
  end

  def t_names
    return {
             en: t_name(:en),
             fr: t_name(:fr),
           }
  end

  def t_name(locale)
    category == :Film ?
      I18n.t(film, locale: locale) :
      scripture == :Other ?
      I18n.t(:AudioScripture, locale: locale) :
      I18n.t(:Audio_x, x: I18n.t(scripture, locale: locale), locale: locale)
  end

  def available_stages
    Stage.stages(:Media)
  end

  def self.build(params, language, participants)
    bible_books = params[:bible_book_ids].nil? ? [] : BibleBook.where(id: params[:bible_book_ids])
    ma_params = params.permit(:category, :scripture, :film).merge(language: language, participants: participants, bible_books: bible_books)
    MediaActivity.create(ma_params)
  end

  def self.search(query)
    activities = MediaActivity.where("category ILIKE unaccent(:q)", { q: "%#{query}%" })
    activities.collect do |activity|
      {
        title: activity.name,
        description: "#{activity.language.name} - #{activity.current_stage.name}",
        route: "activities/#{activity.id}",
      }
    end
  end
end
