class MediaActivity < Activity

  has_and_belongs_to_many :bible_books

  CATEGORIES = %i( AudioScripture JesusFilm LukeFilm ActsFilm )
  SCRIPTURE = %i( Bible Old_testament New_testament Other )

  validates :category, inclusion: CATEGORIES
  validates :scripture, inclusion: SCRIPTURE, allow_nil: true

  def category
    attributes['category'].try(:to_sym)
  end

  def scripture
    attributes['scripture'].try(:to_sym)
  end

  def name
    category == :AudioScripture ? audio_scripture_name : I18n.t(category)
  end

  def self.stages
    Stage.stages(:Media)
  end

  def self.build(params, program, participants)
    ma_params = params.permit(:category, :scripture).merge(program: program, participants: participants)
    MediaActivity.create(ma_params)
  end

  def self.search(query)
    []
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