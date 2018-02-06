class BibleBook < ApplicationRecord

  has_many :translation_activities

  GENESIS_USFM = 1
  MALACHI_USFM = 39
  MATTHEW_USFM = 41
  REVELATION_USFM = 67

  VERSES = 30986
  VERSES_NT = 7957
  VERSES_OT = 23029

  default_scope { order(:usfm_number) }

  def name
    if I18n.locale == :fr
      return french_name
    end
    return english_name
  end

  def testament
    case usfm_number
      when (1 .. 39)
        return :ot
      when (41 .. 67)
        return :nt
    end
  end

  def percent_of_testament
    case testament
      when :ot
        return number_of_verses.to_f / VERSES_OT * 100
      when :nt
        return number_of_verses.to_f / VERSES_NT * 100
    end
  end

  def self.get_old_testament
    where(usfm_number: (GENESIS_USFM..MALACHI_USFM)).order('usfm_number')
  end

  def self.get_new_testament
    where(usfm_number: (MATTHEW_USFM..REVELATION_USFM)).order('usfm_number')
  end

  # def self.verses_in_bible
  #   BibleBook.sum(:number_of_verses)
  # end

  # def self.verses_in_old_testament
  #   BibleBook.where(usfm_number: (GENESIS_USFM..MALACHI_USFM)).sum(:number_of_verses)
  # end
  #
  # def self.verses_in_new_testament
  #   BibleBook.where(usfm_number: (MATTHEW_USFM..REVELATION_USFM)).sum(:number_of_verses)
  # end

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
