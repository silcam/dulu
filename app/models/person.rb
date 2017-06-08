class Person < ApplicationRecord

  belongs_to :organization, required: false
  belongs_to :country
  has_many :pers_prog_rels

  has_many :book_translation_consultants

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :fmid, uniqueness: true, allow_blank: true
  validates :gender, inclusion: { in: %w(M F)}

end
