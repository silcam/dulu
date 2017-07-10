class BibleBook < ApplicationRecord

  has_many :translation_activities

  GENESIS_USFM = 1
  MALACHI_USFM = 39
  MATTHEW_USFM = 41
  REVELATION_USFM = 67

  def name
    if I18n.locale == :fr
      return french_name
    end
    return english_name
  end

  def self.get_old_testament
    BibleBook.where(usfm_number: (GENESIS_USFM..MALACHI_USFM)).order('usfm_number').to_a
  end

  def self.get_new_testament
    BibleBook.where(usfm_number: (MATTHEW_USFM..REVELATION_USFM)).order('usfm_number').to_a
  end

  def self.verses_in_bible
    BibleBook.sum(:number_of_verses)
  end

  def self.verses_in_old_testament
    BibleBook.where(usfm_number: (GENESIS_USFM..MALACHI_USFM)).sum(:number_of_verses)
  end

  def self.verses_in_new_testament
    BibleBook.where(usfm_number: (MATTHEW_USFM..REVELATION_USFM)).sum(:number_of_verses)
  end

  def self.options_for_select(program)
    books = BibleBook.all.order(:usfm_number) - BibleBook.joins(:translation_activities)
                                                .where('activities.program_id=?', program.id)
    return [] if books.empty?
    options = []
    options << [I18n.t(:New_testament), 'nt'] unless books.last.usfm_number < MATTHEW_USFM
    options << [I18n.t(:Old_testament), 'ot'] unless books.first.usfm_number > MALACHI_USFM
    books.each do |book|
      options << [book.name, book.id] unless program.is_translating?(book.id)
    end
    options
  end
end
