class Program < ApplicationRecord

  has_many :books_in_translation
  has_many :bible_books, through: :books_in_translation
  belongs_to :language
end
