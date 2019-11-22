class MediaActivity < Activity
  include TranslationHelper

  has_and_belongs_to_many :bible_books

  CATEGORIES = %i( AudioScripture Film )
  SCRIPTURE = %i( Bible Old_testament New_testament Other )

  validates :category, inclusion: CATEGORIES
  validates :scripture, inclusion: SCRIPTURE, allow_nil: true

  default_scope { where(archived: false) }

  def domain
    :Scripture_use
  end

  def category
    attributes["category"].try(:to_sym)
  end

  def film
    attributes["film"].try(:to_sym)
  end

  def scripture
    attributes["scripture"].try(:to_sym)
  end

  def t_name
    case
    when category == :Film
      t_params(film)
    when scripture == :Other
      t_params(:AudioScripture)
    else
      t_params(:Audio_x, x: t_params(scripture))
    end
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
