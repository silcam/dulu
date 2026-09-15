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

  # `start_date` and `end_date` are *string* columns holding fuzzy dates -- "2026",
  # "2026-09" and "2026-09-15" are all valid -- so every comparison below is
  # lexicographic, not a date comparison. That is why the bounds are built as
  # strings (via FuzzyDate#to_s) and bound as strings: binding an Integer year
  # would emit `end_date = 2026` and Postgres rejects varchar = integer.
  #
  # The filters stay as private helpers returning [sql, *binds] so for_period can
  # still compose them, or use just one, without string-building SQL.

  def self.upcoming
    where("start_date > ?", Date.today.to_s)
  end

  def self.past
    today, year_month, year = today_texts
    where("end_date < ? AND end_date != ? AND end_date != ?", today, year_month, year)
  end

  def self.current
    today, year_month, year = today_texts
    where(
      "start_date <= ? AND (end_date >= ? OR end_date = ? OR end_date = ?)",
      today, today, year_month, year
    )
  end

  def self.for_month(year, month)
    where(*month_filter(year.to_i, month.to_i))
  end

  def self.for_period(start_year = nil, start_month = nil, end_year = nil, end_month = nil)
    # Both may be nil: Api::EventsController#index calls
    # for_period(nil, nil, end_year, end_month) as its fallback, so neither filter
    # can be built unconditionally -- FuzzyDate.new(nil) raises, and
    # FuzzyDateException descends from Exception rather than StandardError, so it
    # is not caught by an ordinary rescue anywhere up the stack.
    s_filter = start_year ? start_filter(start_year, start_month) : nil
    e_filter = end_year ? end_filter(end_year, end_month) : nil

    if s_filter && e_filter
      where("#{s_filter.first} AND #{e_filter.first}", *s_filter.drop(1), *e_filter.drop(1))
    elsif !s_filter && !e_filter
      all
    else
      # Whichever one exists -- not both ORed together.
      where(*(s_filter || e_filter))
    end
  end

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

    def month_filter(year, month)
      ["(start_date < ?) AND (end_date >= ? OR end_date = ?)",
       get_next_month_text(year, month),
       FuzzyDate.new(year, month).to_s,
       year.to_s]
    end

    def start_filter(year, month = nil)
      ["(end_date >= ? OR end_date = ?)",
       FuzzyDate.new(year, month).to_s,
       year.to_i.to_s]
    end

    def end_filter(year, month = nil)
      month ||= 12
      ["(start_date < ?)", get_next_month_text(year, month)]
    end

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
