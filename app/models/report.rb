class Report

  TYPES = %i( LanguageComparison Domain )

  def self.generate(params)
    report = []
    report << [''] + BibleBook.all.collect{ |book| book.name }
    Cluster.where(id: params[:cluster_ids]).each do |cluster|
      cluster.programs.each do |p|
        report << program_report(p, params)
      end
    end
    Language.where(id: params[:program_ids]).each do |program|
      report << program_report(program, params)
    end
    report
  end

  private

  def self.program_report(program, params)
    row = [program.name]
    BibleBook.all.each do |book|
      ta = program.translation_activities.find_by(bible_book: book)
      if ta
        row << ta.stage_name
      else
        row << ''
      end
    end
    row
  end
end