class Program < ApplicationRecord

  has_many :translation_activities
  has_many :bible_books, through: :translation_activities
  has_many :pers_prog_rels
  belongs_to :language
end
