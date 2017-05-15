class BookInTranslation < ApplicationRecord
  
  belongs_to :program
  belongs_to :bible_book
  has_many :book_translation_stages
  has_many :book_translation_consultants

  def current_translation_stage
    self.book_translation_stages.last
  end

  def self.add_new_to_program(program, bible_book_id)
    new_book = program.books_in_translation.create(bible_book_id: bible_book_id)
    new_book.book_translation_stages.create(BookTranslationStage.default_new_params)
  end
end
