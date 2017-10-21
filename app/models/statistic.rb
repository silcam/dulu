class Statistic

  attr_reader :number, :title, :path

  def initialize(stat)
    send(stat)
  end

  def self.stats_for(domain)
    [Statistic.new(:translations_in_progress),
     Statistic.new(:publications_this_year)]
  end

  private

  def translations_in_progress
    planning_id = StageName.first_stage('translation').id
    published_id = StageName.last_stage('translation').id
    @number = TranslationActivity.joins(:stages)
                                  .where("stages.current AND
                                          stages.stage_name_id != ? AND
                                          stages.stage_name_id != ?",
                                          planning_id,
                                          published_id)
                                  .count
    @title = I18n.t(:Book).pluralize(@number) + ' ' + I18n.t(:being_translated)
    @path = ''
  end

  def publications_this_year
    @number = Publication.where(year: Date.today.year).count
    @title = I18n.t(:new_publication).pluralize(@number) + ' ' + I18n.t(:in) + ' ' + Date.today.year.to_s
    @path = ''
  end

end