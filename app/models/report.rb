class Report < ApplicationRecord
  belongs_to :author, class_name: 'Person'
  has_many :viewed_reports

  validates :report, presence: true, allow_blank: false
  validates :name, presence: true, allow_blank: false

  TYPES = %i( LanguageComparison )
  PUBLICATIONS = %i( Bible New_testament Portions Audio_Bible Audio_New_testament
                     JesusFilm LukeFilm App)

  def generate
    case params[:type]
      when 'LanguageComparison'
        generate_language_comparison
    end
  end

  def params
    JSON.parse(self.attributes['params'], symbolize_names: true)
  end

  def report
    self.attributes['report'].with_indifferent_access
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
    ds_items = language.domain_status_items.to_a
    PUBLICATIONS.each do |pub_type|
      pubs[pub_type] = pub_published?(ds_items, pub_type.to_s)
    end
    pubs
  end

  def self.pub_published?(ds_items, pub)
    case pub
      when 'Bible', 'New_testament', 'Portions'
        return ds_items.any? { |dsi| dsi.category == "PublishedScripture" && dsi.subcategory == pub }

      when 'Audio_Bible', 'Audio_New_testament'
        key = pub[(6..-1)] # Chop off 'Audio_'
        return ds_items.any? { |dsi| dsi.category == "AudioScripture" && dsi.subcategory == key}

      when 'JesusFilm', 'LukeFilm'
        return ds_items.any? { |dsi| dsi.category == "Film" && dsi.subcategory == pub }

      when 'App'
        return ds_items.any? { |dsi| dsi.category == "ScriptureApp" }
    end
  end
end