class BookTranslationStatus < ApplicationRecord

  belongs_to :book_in_translation
  belongs_to :translation_stage
  
end
