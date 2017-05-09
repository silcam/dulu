class BookTranslationConsultant < ApplicationRecord

  belongs_to :book_in_translation
  belongs_to :person

  validates :start_date, presence: true #TODO validate that the date is in the past
  #validate end_date in past or nil
end
