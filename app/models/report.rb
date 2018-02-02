class Report

  TYPES = %i( LanguageComparison Domain )

  def self.generate(params)
    case params[:type]
      when 'LanguageComparison'
        generate_language_comparison params
    end
  end

  private

  def self.generate_language_comparison(params)
    report = {clusters: {}, programs: {}}
    report[:elements] = params[:elements]
    Cluster.where(id: params[:cluster_ids]).each do |cluster|
      report[:clusters][cluster] = {}
      cluster.programs.each do |program|
        report[:clusters][cluster][program] = lc_program_report(program, params)
      end
    end
    Program.where(id: params[:program_ids]).each do |program|
      report[:programs][program] = lc_program_report(program, params)
    end
    report

  end

  def self.lc_program_report(program, params)
    report = {activities: {}, publications: {}}
    if params[:elements][:activities].include? 'old_testament'
      report[:activities][:old_testament] = bible_books_report(program, BibleBook.get_old_testament)
    end
    if params[:elements][:activities].include? 'new_testament'
      report[:activities][:new_testament] = bible_books_report(program, BibleBook.get_new_testament)
    end
    report
  end

  def self.bible_books_report(program, bible_books)
    report = []
    bible_books.each do |book|
      book_report = {name: book.name}
      ta = program.translation_activities.find{ |a| a.bible_book==book }
      book_report[:stage] = ta.current_stage if ta
      report << book_report
    end
    report
  end
end