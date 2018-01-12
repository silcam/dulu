class MediaActivity < Activity

  has_and_belongs_to_many :bible_books

  CATEGORIES = %i( AudioScripture JesusFilm LukeFilm ActsFilm )
  SCRIPTURE = %i( Bible OldTestament NewTestament Other )

  validates :category, inclusion: CATEGORIES
  validates :scripture, inclusion: SCRIPTURE

  def self.search(query)
    []
  end
end