class BibleBook < ApplicationRecord

  has_many :translation_activities

  GENESIS_ID = 1
  MALACHI_ID = 39
  MATTHEW_ID = 40
  REVELATION_ID = 66

  def name
    if I18n.locale == :fr
      return french_name
    end
    return english_name
  end

  def self.get_old_testament
    BibleBook.where(id: (GENESIS_ID..MALACHI_ID)).order('id').to_a
  end

  def self.get_new_testament
    BibleBook.where(id: (MATTHEW_ID..REVELATION_ID)).order('id').to_a
  end

  def self.verses_in_bible
    BibleBook.sum(:number_of_verses)
  end

  def self.verses_in_old_testament
    BibleBook.where(id: (GENESIS_ID..MALACHI_ID)).sum(:number_of_verses)
  end

  def self.verses_in_new_testament
    BibleBook.where(id: (MATTHEW_ID..REVELATION_ID)).sum(:number_of_verses)
  end

end
