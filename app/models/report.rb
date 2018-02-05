class Report < ApplicationRecord

  has_many :viewed_reports

  validates :params, presence: true, allow_blank: false
  validates :name, presence: true, allow_blank: false

  TYPES = %i( LanguageComparison )

  def generate
    case params[:type]
      when 'LanguageComparison'
        generate_language_comparison
    end
  end

  def params
    JSON.parse(self.attributes['params'], symbolize_names: true)
  end

  def self.make_name(params)
    case params[:type]
      when 'LanguageComparison'
        name="%{LanguageComparison}: "
        name += Cluster.where(id: params[:cluster_ids]).collect{ |c| c.display_name }.join(', ')
        name += ', ' if params[:cluster_ids] && params[:program_ids]
        name += Program.where(id: params[:program_ids]).collect{ |p| p.name }.join(', ')
        name
    end
  end

  private

  def generate_language_comparison
    report = {clusters: {}, programs: {}}
    report[:elements] = params[:elements]
    Cluster.where(id: params[:cluster_ids]).each do |cluster|
      report[:clusters][cluster] = {}
      cluster.programs.each do |program|
        report[:clusters][cluster][program] = lc_program_report(program)
      end
    end
    Program.where(id: params[:program_ids]).each do |program|
      report[:programs][program] = lc_program_report(program)
    end
    report

  end

  def lc_program_report(program)
    report = { activities: {}, publications: [] }

    if params[:elements] && params[:elements][:activities]
      if params[:elements][:activities].include? 'Old_testament'
        report[:activities][:old_testament] = bible_books_report(program, BibleBook.get_old_testament)
      end
      if params[:elements][:activities].include? 'New_testament'
        report[:activities][:new_testament] = bible_books_report(program, BibleBook.get_new_testament)
      end
    end

    if params[:elements] && params[:elements][:publications]
      params[:elements][:publications].each do |pub|
        report[:publications] << pub_report(program, pub)
      end
    end

    report
  end

  def bible_books_report(program, bible_books)
    report = []
    bible_books.each do |book|
      book_report = {name: book.name}
      ta = program.translation_activities.find{ |a| a.bible_book==book }
      book_report[:stage] = ta.current_stage if ta
      report << book_report
    end
    report
  end

  def pub_report(program, pub)
    {
        name: pub,
        published?: pub_published?(program, pub)
    }
  end

  def pub_published?(program, pub)
    case pub
      when 'Bible', 'New_testament', 'Old_testament'
        return program
            .publications
            .where("kind='Scripture' AND (english_name ILIKE ? OR french_name ILIKE ?)",
                  "%#{I18n.t(pub, locale: :en)}%",
                   "%#{I18n.t(pub, locale: :fr)}%"
            ).count > 0

      when 'Any_scripture'
        return !program.publications.find_by(kind: :Scripture).nil?

      when 'Audio_Bible', 'Audio_New_testament', 'Audio_Old_testament'
        key = pub[(6..-1)] # Chop off 'Audio_'
        return program
               .publications
               .where("kind='Media' AND media_kind='Audio' AND (english_name ILIKE ? OR french_name ILIKE ?)",
                                      "%#{I18n.t(key, locale: :en)}%",
                                      "%#{I18n.t(key, locale: :fr)}%"
               ).count > 0

      when 'JesusFilm', 'LukeFilm'
        key = pub.chomp('Film')
        return program
                   .publications
                   .where("kind='Media' AND media_kind='Video' AND english_name ILIKE ?",
                          "%#{key}%"
                   ).count > 0

      when 'App'
        return !program.publications.find_by(kind: :Media, media_kind: :App).nil?

      when 'Dictionary'
        return program
                   .publications
                   .where("kind='Linguistic' AND (english_name ILIKE ? OR french_name ILIKE ?)",
                                          "%#{I18n.t(pub, locale: :en)}%",
                                          "%#{I18n.t(pub, locale: :fr)}%"
                   ).count > 0

      when 'Any_literacy'
        return !program.publications.find_by(kind: :Literacy).nil?
    end
  end
end