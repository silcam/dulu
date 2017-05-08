class BibleBook < ApplicationRecord

  has_many :books_in_translation

  def self.verses_in_bible
    BibleBook.sum(:number_of_verses)
  end

  def self.verses_in_new_testament
    BibleBook.where("id BETWEEN 40 AND 66").sum(:number_of_verses)
  end

  def self.verses_in_old_testament
    BibleBook.where("id < 40").sum(:number_of_verses)
  end

end
