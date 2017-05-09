class Project < ApplicationRecord

  has_many :books_in_translation
  belongs_to :language
end
