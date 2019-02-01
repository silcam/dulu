class Report < ApplicationRecord
  belongs_to :author, class_name: 'Person'
  has_many :viewed_reports

  validates :report, presence: true, allow_blank: false
  validates :name, presence: true, allow_blank: false

  TYPES = %i( LanguageComparison )
  PUBLICATIONS = %i( Bible New_testament Old_testament Any_scripture Audio_Bible Audio_New_testament
                     Audio_Old_testament JesusFilm LukeFilm App Dictionary Any_literacy)

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
        name += ', ' if params[:cluster_ids] && params[:language_ids]
        name += Language.where(id: params[:language_ids]).collect{ |p| p.name }.join(', ')
        name
    end
  end

  def self.get_language_report(report_type, language)
    return lc_language_report(language)
  end

  def self.get_cluster_report(report_type, cluster)
    return lc_cluster_report(cluster)
  end

  private

  def generate_language_comparison
    report = {clusters: {}, languages: {}}
    report[:elements] = params[:elements]
    Cluster.where(id: params[:cluster_ids]).each do |cluster|
      report[:clusters][cluster] = {}
      cluster.languages.each do |language|
        report[:clusters][cluster][language] = lc_language_report(language)
      end
    end
    Language.where(id: params[:language_ids]).each do |language|
      report[:languages][language] = lc_language_report(language)
    end
    report
  end

  def self.lc_cluster_report(cluster)
    {
      id: cluster.id,
      name: cluster.name,
      languages: cluster.languages.collect do |language|
        lc_language_report(language)
      end
    }
  end

  def self.lc_language_report(language)
    {
      id: language.id,
      name: language.name,
      report: {
        publications: pubs_report(language),
        activities: {
          Old_testament: bible_books_report(language, BibleBook.get_old_testament),
          New_testament: bible_books_report(language, BibleBook.get_new_testament)
        }
      }
    }
  end

  def self.bible_books_report(language, bible_books)
    bible_books.collect do |book|
      ta = language.translation_activities.find{ |a| a.bible_book==book }
      ta ? ta.current_stage.name : ""
    end
  end

  def self.pubs_report(language)
    pubs = {}
    PUBLICATIONS.each do |pub_type|
      pubs[pub_type] = pub_published?(language, pub_type)
    end
    pubs
  end

  def self.pub_published?(language, pub)
    case pub.to_s
      when 'Bible', 'New_testament', 'Old_testament'
        return true if language.publications.find_by(kind: :Scripture, scripture_kind: pub)

      when 'Any_scripture'
        return true if language.publications.find_by(kind: :Scripture)

      when 'Audio_Bible', 'Audio_New_testament', 'Audio_Old_testament'
        key = pub[(6..-1)] # Chop off 'Audio_'
        return true if language.publications.find_by(media_kind: :AudioScripture, scripture_kind: key)

      when 'JesusFilm', 'LukeFilm'
        return true if language.publications.find_by(film_kind: pub)

      when 'App'
        return true if language.publications.find_by(kind: :Media, media_kind: :App)

      when 'Dictionary'
        return language
                   .publications
                   .where("kind='Linguistic' AND (english_name ILIKE ? OR french_name ILIKE ?)",
                                          "%#{I18n.t(pub, locale: :en)}%",
                                          "%#{I18n.t(pub, locale: :fr)}%"
                   ).count > 0

      when 'Any_literacy'
        return true if language.publications.find_by(kind: :Literacy)
    end
  end
end