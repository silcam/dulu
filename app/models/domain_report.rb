class DomainReport
  attr_reader :domain, 
              :period,
              :language_ids,
              :cluster_ids,
              :languages, 
              :status_items, 
              :events, 
              :activity_items

  def initialize(domain, period, language_ids=nil, cluster_ids=nil)
    @domain = domain
    @period = period
    @language_ids = language_ids
    @cluster_ids = cluster_ids
  end

  def self.from_web_params(params)
    period = Period.new(JSON.parse(params[:period]).with_indifferent_access)
    return DomainReport.new(
      params[:domain], 
      period, 
      params[:languageIds],
      params[:clusterIds]
    )
  end

  def self.from_database(report)
    params = report.report[:dataParams]
    return DomainReport.new(
      params[:domain],
      Period.new(params[:period]),
      params[:languageIds],
      params[:clusterIds]
    )
  end

  def generate
    gen_languages
    gen_activity_items
    gen_status_items
    gen_events
  end
  
  private
  
  def gen_languages
    langs = @language_ids ? 
      Language.where(id: @language_ids) :
      [] 
    clusters = @cluster_ids ?
      Cluster.where(id: @cluster_ids) :
      []
    langs += clusters.map{ |cluster| cluster.languages }.flatten
    langs.uniq!
    return  @languages = langs.length > 0 ? langs : nil
  end

  def gen_activity_items
    return [] unless domain == "Translation"
    start_period_str = @period.start.month == 1 ? @period.start.year.to_s : @period.start.to_s
    stage_src = @languages ? Stage.joins(:activity).where(activities: {language: @languages}) : Stage
    stages = stage_src.where(kind: :Translation)
                      .where("start_date < '#{@period.finish}-32'")
                      .where("start_date >= '#{start_period_str}'")
                      .order(start_date: :desc)
                      .includes(:activity)
    @activity_items = stages.map do |stage|
      {
        activity: stage.activity.attributes.merge({type: stage.activity.type}),
        id: stage.id,
        stage: stage.name,
        date: stage.start_date 
      }
    end
  end

  def gen_status_items
    dsi_src = @languages ? DomainStatusItem.where(language: @languages) : DomainStatusItem
    categories = DomainStatusItem.categories_for(@domain)
    @status_items = dsi_src.where(category: categories, year: (@period.start.year..@period.finish.year))
  end

  def gen_events
    event_src = @languages ? languages_events(@languages) : Event
    @events = event_src
      .for_period(@period.start.year, @period.start.month, @period.finish.year, @period.finish.month)
      .where(domain: domain)
      .includes(:event_participants)
      .includes(:languages)
      .includes(:clusters)
      .reverse
  end

  def languages_events(languages)
    language_ids = languages.map { |lang| lang.id }
    cluster_ids = languages.find_all{ |lang| lang.cluster_id }.map{ |lang| lang.cluster_id }
    return Event.left_outer_joins(:languages, :clusters)
    .where("events_languages.language_id IN (?) OR clusters_events.cluster_id IN (?)", language_ids, cluster_ids)
  end
end