class TranslationActivity < Activity

  belongs_to :bible_book
  # has_many :book_translation_consultants TODO Delete this line

  def name
    self.bible_book.name
  end

  def next
    list = self.program.sorted_translation_activities
    index = list.index(self)
    return list[index + 1] # This returns nil when we go off the back
  end

  def prev
    list = self.program.sorted_translation_activities
    index = list.index(self)
    return index==0 ? nil : list[index - 1]
  end

  def self.stages
    Stage.stages(:Translation)
  end

  def self.build(params, program, participants)
    activity = nil
    if ['nt', 'ot'].include? params[:bible_book_id]
      books = (params[:bible_book_id] == 'nt') ? BibleBook.get_new_testament : BibleBook.get_old_testament
      books.each do |book|
        unless program.is_translating? book
          activity = TranslationActivity.create! program: program, participants: participants, bible_book: book
        end
      end
      activity
    else
      TranslationActivity.create! program: program, participants: participants, bible_book_id: params[:bible_book_id]
    end
  end

  def self.in_progress
    joins(:stages).where("stages.current AND
                          stages.name != ? AND
                          stages.name != ?",
                         'Planned',
                         'Published')
  end

  def self.search(query)
    books = BibleBook.where("english_name ILIKE ? OR french_name ILIKE ?", "%#{query}%", "%#{query}%")
    results = []
    books.each do |book|
      subresults = []
      activities = TranslationActivity.where bible_book: book
      activities.each do |activity|
        subresults << {title: activity.program.name,
                       description: I18n.t(activity.stage_name),
                       model: activity}
      end
      description = activities.empty? ? I18n.t(:No_current_translations) : ''
      results << {title: book.name,
                  description: description,
                  subresults: subresults}
    end
    results
  end
end
