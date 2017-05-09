class BookInTranslation < ApplicationRecord
  
  belongs_to :project
  belongs_to :bible_book
  has_many :book_translation_statuses
  has_many :book_translation_consultants

end
