class TranslationActivity < Activity
  belongs_to :bible_book

  default_scope { where(archived: false) }

  def name
    self.bible_book.name
  end

  def domain
    :Translation
  end

  def next
    list = self.language.sorted_translation_activities
    index = list.index(self)
    return list[index + 1] # This returns nil when we go off the back
  end

  def prev
    list = self.language.sorted_translation_activities
    index = list.index(self)
    return index == 0 ? nil : list[index - 1]
  end

  def available_stages
    Stage.stages(:Translation)
  end

  def self.build(params, language, participants)
    activity = nil
    if ["nt", "ot"].include? params[:bible_book_id]
      books = (params[:bible_book_id] == "nt") ? BibleBook.get_new_testament : BibleBook.get_old_testament
      books.each do |book|
        unless language.is_translating? book
          activity = TranslationActivity.create! language: language, participants: participants, bible_book: book
        end
      end
      activity
    else
      TranslationActivity.create! language: language, participants: participants, bible_book_id: params[:bible_book_id]
    end
  end

  def self.in_progress
    joins(:stages).where("stages.current AND
                          stages.name != ? AND
                          stages.name != ?",
                         "Planned",
                         "Published")
  end

  def self.by_testament(testament)
    case testament.to_sym
    when :New_testament
      usfm_range = (41..67)
    when :Old_testament
      usfm_range = (1..39)
    else
      return nil
    end
    joins(:bible_book).where(bible_books: { usfm_number: usfm_range })
  end

  def self.archivable?(language, testament)
    activities = language.translation_activities.by_testament(testament)
    activities.count > 0 && !activities.any? { |ta| !ta.archivable? }
  end

  def self.archive(language, testament)
    activities = language.translation_activities.by_testament(testament)
    activities.update archived: true
  end

  # Unreachable, and in a shape the API can no longer render. Api::SearchesController
  # has had Activity.search commented out since 91819c6 (Dec 2018) -- a concurrent
  # refactor had commented out `belongs_to :bible_book`, so this method raised; the
  # association is back and the method works, but the controller line was never
  # restored. Meanwhile the subresults below no longer serialise: global search is a
  # flat list now and _search.json.jbuilder has no branch for nested rows. This
  # method is the one search whose entire payload is subresults, hung under a
  # route-less BibleBook parent, so re-enabling it means restructuring to one row
  # per activity ("Genesis : Hdi") -- a design change, not an uncomment. Filed in
  # UPGRADE_PLAN.md Phase 8f.
  def self.search(query)
    books = BibleBook.where("english_name ILIKE ? OR unaccent(french_name) ILIKE unaccent(?)", "%#{query}%", "%#{query}%")
    results = []
    books.each do |book|
      subresults = []
      activities = TranslationActivity.where bible_book: book
      activities.each do |activity|
        subresults << { title: activity.language.name,
                        description: I18n.t(activity.stage_name),
                        route: "/activities/#{activity.id}" }
      end
      description = activities.empty? ? I18n.t(:No_current_translations) : ""
      results << { title: book.name,
                   description: description,
                   subresults: subresults }
    end
    results
  end
end
