class MediaActivity < Activity
  has_and_belongs_to_many :bible_books

  CATEGORIES = %i( AudioScripture Film )
  FILMS = %i( JesusFilm LukeFilm ActsFilm GenesisFilm StoryOfGenesisFilm BookOfJohn MagdalenaFilm )
  SCRIPTURE = %i( Bible Old_testament New_testament Other )

  validates :category, inclusion: CATEGORIES
  validates :film, inclusion: FILMS, allow_nil: true
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

  def name
    category == :AudioScripture ? audio_scripture_name : I18n.t(film)
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

  private

  def audio_scripture_name
    if scripture == :Other
      I18n.t(:AudioScripture)
    else
      I18n.t(:Audio_x, x: I18n.t(scripture))
    end
  end
end
