class TranslationActivity < Activity

  belongs_to :bible_book
  has_many :book_translation_consultants

  def self.add_new_to_program(program, bible_book_id)
    new_book = program.translation_activities.create!(bible_book_id: bible_book_id)
    new_book.stages.create!(Stage.default_new_params(:translation))
  end

  def name
    self.bible_book.name
  end

  def build(params)
    return if program.is_translating? params[:bible_book]
    self.bible_book_id = params[:bible_book]
    super
  end

  def self.build_all(program, params)
    if ['nt', 'ot'].include? params[:bible_book]
      books = BibleBook.get_new_testament if params[:bible_book] == 'nt'
      books = BibleBook.get_old_testament if params[:bible_book] == 'ot'
      books.each do |book|
        params[:bible_book] = book.id
        TranslationActivity.new(program: program).build(params)
      end
    else
      TranslationActivity.new(program: program).build(params)
    end
  end

  def self.search(query)
    books = BibleBook.where("english_name LIKE ? OR french_name LIKE ?", "%#{query}%", "%#{query}%")
    results = []
    books.each do |book|
      subresults = []
      activities = TranslationActivity.where bible_book: book
      activities.each do |activity|
        subresults << {title: activity.program.name, description: I18n.t(activity.stage_name),
            path: Rails.application.routes.url_helpers.translation_activity_path(activity)}
      end
      description = activities.empty? ? I18n.t(:No_current_translations) : ''
      results << {title: book.name, description: description, subresults: subresults}
    end
    results
  end
end
