# frozen_string_literal: true

class Event < ApplicationRecord
  include MultiWordSearch

  has_and_belongs_to_many :languages
  has_and_belongs_to_many :clusters
  has_many :event_participants, autosave: true, dependent: :destroy
  accepts_nested_attributes_for :event_participants, allow_destroy: true
  has_many :people, through: :event_participants
  belongs_to :creator, required: false, class_name: 'Person'
  has_one :workshop, dependent: :nullify
  belongs_to :event_location, required: false

  audited

  default_scope { order(start_date: :desc) }

  validates :domain, inclusion: { in: Domain.domains }
  validates :name, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :start_date, fuzzy_date: true
  validates :end_date, fuzzy_date: true
  validate :end_date_not_before_start_date

  def end_date_not_before_start_date
    start_fuzzy = FuzzyDate.from_string start_date
    end_fuzzy = FuzzyDate.from_string end_date
    errors.add(:end_date, "can't be before start date") if end_fuzzy.before?(start_fuzzy)
  rescue (FuzzyDateException)
    # No worries, the fuzzy date validator will complain about this
  end

  def display_name
    name
  end

  def dates_display_text
    start = f_start_date
    finish = f_end_date
    date_text = start.pretty_print(no_relative_dates: true)
    date_text += ' ' + I18n.t(:to) + ' ' + finish.pretty_print(no_relative_dates: true) if start != finish
    date_text
  end

  def cluster_languages
    clusters + languages
  end

  def f_start_date
    FuzzyDate.from_string start_date
  rescue (FuzzyDateException)
    nil
  end

  def f_end_date
    FuzzyDate.from_string end_date
  rescue (FuzzyDateException)
    nil
  end

  def all_languages
    all = languages
    clusters.each do |c|
      all += c.languages
    end
    all
  end

  def unassoc_languages
    Language.where.not(id: languages)
  end

  def unassoc_clusters
    Cluster.where.not(id: clusters)
  end

  def unassoc_people
    Person.where.not(id: people)
  end

  def associated_with?(user)
    return true if creator == user
    return true if people.include? user

    person_languages_list = user.current_languages
    languages.each { |p| return true if person_languages_list.include? p }
    clusters.each do |c|
      c.languages.each { |p| return true if person_languages_list.include? p }
    end

    false
  end

  def self.upcoming
    where(upcoming_filter)
  end

  def self.past
    where(past_filter)
  end

  def self.current
    where(current_filter)
  end

  def self.for_month(year, month)
    where(month_filter(year.to_i, month.to_i))
  end

  def self.for_period(start_year = nil, start_month = nil, end_year = nil, end_month = nil)
    s_filter = start_year ?
      start_filter(start_year, start_month) :
      nil
    e_filter = end_year ?
      end_filter(end_year, end_month) :
      nil
    if s_filter && e_filter
      where(s_filter + ' AND ' + e_filter)
    elsif !s_filter && !e_filter
      all
    else
      where(s_filter || e_filter)
    end
  end

  # def self.for_year(year)
  #   where(year_filter(year.to_i))
  # end

  # def self.for_year_and_later(year)
  #   where(year_and_later_filter(year.to_i))
  # end

  def self.search(query)
    events = Event.multi_word_where(query, 'name')
    results = []
    events.each do |event|
      title = event.name.to_s
      description = event.dates_display_text
      description_cluster_progs = (event.clusters + event.languages).collect(&:display_name).join(', ')
      description += ' - ' + description_cluster_progs unless description_cluster_progs.blank?
      results << { title: title, description: description, model: event }
    end
    results
  end

  class << self
    private

    ## DELETE ALL THIS ========================
    # SQL Injection?
    # Ok because inserted text comes from Date.to_s which does not produce malicious SQL
    def upcoming_filter
      "start_date > '#{Date.today}'"
    end

    # SQL Injection?
    # Ok because inserted texts all come from self.today_texts which does not produce malicious SQL
    def past_filter
      today, year_month, year = today_texts
      "end_date < '#{today}' AND end_date != '#{year_month}' AND end_date != '#{year}'"
    end

    # SQL Injection?
    # Ok because inserted texts all come self.today_texts which does not produce malicious SQL
    def current_filter
      today, year_month, year = today_texts
      "start_date <= '#{today}' AND (end_date >= '#{today}' OR end_date = '#{year_month}' OR end_date = '#{year}')"
    end

    ## DOWN TO HERE ==============================

    # SQL Injection?
    # Ok because inserted texts all come from FuzzyDate.to_s which does not produce malicious SQL
    def month_filter(year, month)
      month_text = FuzzyDate.new(year, month).to_s
      next_month_text = get_next_month_text(year, month)
      "(start_date < '#{next_month_text}') AND 
      (end_date >= '#{month_text}' OR end_date = '#{year}')"
    end

    # SQL Injection?
    # Ok because inserted texts all come from FuzzyDate.to_s which does not produce malicious SQL
    def start_filter(year, month = nil)
      date_str = FuzzyDate.new(year, month).to_s
      "(end_date >= '#{date_str}' OR end_date = '#{year.to_i}')"
    end

    # SQL Injection?
    # Ok because inserted texts all come from FuzzyDate.to_s which does not produce malicious SQL
    def end_filter(year, month = nil)
      month ||= 12
      next_month_text = get_next_month_text(year, month)
      "(start_date < '#{next_month_text}')"
    end

    # # SQL Injection?
    # # Ok because year is an int
    # def year_filter(year)
    #   year = year.to_i
    #   "(start_date < '#{year+1}') AND (end_date >= '#{year}')"
    # end

    # # SQL Injection?
    # # Ok because year is an int
    # def year_and_later_filter(year)
    #   year = year.to_i
    #   "end_date >= '#{year}'"
    # end

    def get_next_month_text(year, month)
      month.to_i == 12 ? FuzzyDate.new(year.to_i + 1).to_s : FuzzyDate.new(year, month.to_i + 1).to_s
    end

    def today_texts
      today = Date.today.to_s
      year_month = today[0, 7] # YYYY-MM
      year = today[0, 4] # YYYY
      [today, year_month, year]
    end
  end
end
