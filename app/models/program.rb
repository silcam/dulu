class Program < ApplicationRecord

  has_many :translation_activities
  has_many :bible_books, through: :translation_activities
  belongs_to :language
end
