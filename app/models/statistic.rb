class Statistic

  attr_reader :number, :title, :path, :description, :model

  def initialize(stat)
    send(stat)
  end

  def self.stats_for(domain)
    [Statistic.new(:translations_in_progress),
     Statistic.new(:publications_this_year)]
  end

  def self.latest
    [Statistic.new(:latest_published_scripture),
     Statistic.new(:latest_media),
     Statistic.new(:latest_translation_started)]
  end

  private

  def translations_in_progress
    @number = TranslationActivity.in_progress.count
    @title = I18n.t(:Book).pluralize(@number) + ' ' + I18n.t(:being_translated)
    @path = ''
  end

  def publications_this_year
    @number = Publication.where(year: Date.today.year).count
    @title = I18n.t('new_publication'.pluralize(@number)) + ' ' + I18n.t(:in) + ' ' + Date.today.year.to_s
    @path = ''
  end

  # Latest

  def latest_published_scripture
    @model = Publication.where("kind='Scripture' and year IS NOT NULL").last
    @title = I18n.t(:Published_scripture)
    @description = "#{@model.program.name} #{@model.name}"
  end

  def latest_media
    @model = Publication.where("kind='Media' and year IS NOT NULL").last
    @title = I18n.t(:Published_media)
    @description = "#{@model.program.name} #{@model.name}"
  end

  def latest_translation_started
    drafting = StageName.find_by(kind: 'translation', level: 2)
    translation = Stage.order("start_date DESC").find_by(stage_name: drafting).activity
    @title = I18n.t(:Translation_started)
    @model = translation.program
    @description = "#{@model.name} #{translation.bible_book.name}"
  end
end