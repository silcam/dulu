class BookInTranslation < ApplicationRecord
  
  belongs_to :project
  belongs_to :bible_book
  has_many :book_translation_statuses
  has_many :book_translation_consultants

  def current_translation_stage
    self.book_translation_statuses.last
  end

  def self.add_new_to_project(project, bible_book_id)
    new_book = project.books_in_translation.create(bible_book_id: bible_book_id)
    new_book.book_translation_statuses.create(BookTranslationStatus.default_new_params)
  end
end
