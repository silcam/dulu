class Event < ApplicationRecord
  include MultiWordSearch

  has_and_belongs_to_many :programs
  has_and_belongs_to_many :clusters
  has_many :event_participants, autosave: true, dependent: :destroy
  has_many :people, through: :event_participants
  belongs_to :creator, required: false, class_name: 'Person'
  has_one :workshop

  audited

  default_scope{ order(start_date: :desc) }

  validates :domain, inclusion: {in: StatusParameter.domains}
  validates :name, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :start_date, fuzzy_date: true
  validates :end_date, fuzzy_date: true
  validate :end_date_not_before_start_date

  def end_date_not_before_start_date
    begin
      start_fuzzy = FuzzyDate.from_string start_date
      end_fuzzy = FuzzyDate.from_string end_date
      if end_fuzzy.before?(start_fuzzy)
        errors.add(:end_date, "can't be before start date")
      end
    rescue (FuzzyDateException)
      # No worries, the fuzzy date validator will complain about this
    end
  end

  def display_name
    name
  end

  def dates_display_text
    start = f_start_date
    finish = f_end_date
    date_text = start.pretty_print(no_relative_dates: true)
    if start != finish
      date_text += ' ' + I18n.t(:to) + ' ' + finish.pretty_print(no_relative_dates: true)
    end
    date_text
  end

  def cluster_programs
    clusters + programs
  end

  def f_start_date
    begin
      FuzzyDate.from_string self.start_date
    rescue (FuzzyDateException)
      nil
    end
  end

  def f_end_date
    begin
      FuzzyDate.from_string self.end_date
    rescue (FuzzyDateException)
      nil
    end
  end

  def all_programs
    all = programs
    clusters.each do |c|
      all += c.programs
    end
    all
  end

  def unassoc_programs
    Program.where.not(id: programs)
  end

  def unassoc_clusters
    Cluster.where.not(id: clusters)
  end

  def unassoc_people
    Person.where.not(id: people)
  end

  def associated_with?(user)
    return true if creator == user
    return true if self.people.include? user

    person_programs_list = user.current_programs
    self.programs.each{ |p| return true if person_programs_list.include? p }
    self.clusters.each do |c|
      c.programs.each{ |p| return true if person_programs_list.include? p }
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

  def self.search(query)
    events = Event.multi_word_where(query, 'name')
    results = []
    events.each do |event|
      title = "#{event.name}"
      description = event.dates_display_text
      description_cluster_progs = (event.clusters + event.programs).collect{ |cp| cp.display_name }.join(', ')
      description += ' - ' + description_cluster_progs unless description_cluster_progs.blank?
      results << {title: title, description: description, model: event}
    end
    results
  end

  private

  # SQL Injection?
  # Ok because inserted text comes from Date.to_s which does not produce malicious SQL
  def self.upcoming_filter
    "start_date > '#{Date.today.to_s}'"
  end

  # SQL Injection?
  # Ok because inserted texts all come from self.today_texts which does not produce malicious SQL
  def self.past_filter
    today, year_month, year = today_texts
    "end_date < '#{today}' AND end_date != '#{year_month}' AND end_date != '#{year}'"
  end

  # SQL Injection?
  # Ok because inserted texts all come self.today_texts which does not produce malicious SQL
  def self.current_filter
    today, year_month, year = today_texts
    "start_date <= '#{today}' AND (end_date >= '#{today}' OR end_date = '#{year_month}' OR end_date = '#{year}')"
  end

  # SQL Injection?
  # Ok because inserted texts all come from FuzzyDate.to_s which does not produce malicious SQL
  def self.month_filter(year, month)
    month_text = FuzzyDate.new(year, month).to_s
    next_month_text = get_next_month_text(year, month)
    "start_date < '#{next_month_text}' AND end_date >= '#{month_text}'"
  end

  def self.get_next_month_text(year, month)
    return month == 12 ? FuzzyDate.new(year + 1, 1).to_s : FuzzyDate.new(year, month + 1).to_s
  end
      

  def self.today_texts
    today = Date.today.to_s
    year_month = today[0, 7] # YYYY-MM
    year = today[0, 4] # YYYY
    return today, year_month, year
  end
end
