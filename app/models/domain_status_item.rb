class DomainStatusItem < ApplicationRecord
  belongs_to :language
  belongs_to :organization, required: false
  belongs_to :person, required: false
  belongs_to :creator, required: false, class_name: 'Person'
  has_and_belongs_to_many :bible_books

end