class TranslationActivity < Activity

  belongs_to :bible_book
  has_many :book_translation_consultants

  def self.add_new_to_program(program, bible_book_id)
    new_book = program.translation_activities.create!(bible_book_id: bible_book_id)
    new_book.stages.create!(Stage.default_new_params(:translation))
  end

  def name
    self.bible_book.name
  end
end
