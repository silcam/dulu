class Event < ApplicationRecord
  has_and_belongs_to_many :programs
  has_and_belongs_to_many :clusters
  has_many :event_participants, autosave: true, dependent: :destroy
  has_many :people, through: :event_participants
  belongs_to :creator, required: false, class_name: 'Person'
  has_one :workshop

  audited

  default_scope{ order(:start_date) }

  # NB: The kind field is being deprecated
  enum kind: [:Consultation]

  # validates :kind, inclusion: { in: Event.kinds }
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
    where("start_date > ?", Date.today.to_s)
  end

  def self.events_as_hash(events=nil)
    events = Event.all if events.nil?
    event_hash = {past: [], current: [], future: []}
    events.each do |event|
      if event.f_end_date.past?
        event_hash[:past] << event
      elsif event.f_start_date.future?
        event_hash[:future] << event
      else
        event_hash[:current] << event
      end
    end
    event_hash
  end

  def self.search(query)
    q_words = query.split(' ')
    where_clause = q_words.collect{ |w| "name ILIKE ?"}.join(' AND ')
    q_words.collect!{ |w| "%#{w}%" }
    events = Event.where where_clause, *q_words
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
end
