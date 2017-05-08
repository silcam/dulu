class BookInTranslation < ApplicationRecord
  
  belongs_to :project
  belongs_to :bible_book
  belongs_to :translation_stage
  belongs_to :person, :foreign_key => 'linguist_id', required: false

end
