class Event < ApplicationRecord
  has_and_belongs_to_many :programs
  has_and_belongs_to_many :clusters
  has_many :event_participants, autosave: true, dependent: :destroy
  has_many :people, through: :event_participants

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

  def role_of(person)
    self.event_participants.where(person: person).first.try(:program_role)
  end

  def associated_with?(user)
    return true if self.people.include? user

    event_programs_list = self.programs.collect{|p| p.id}
    assocs = Participant.where("person_id=? AND program_id IN (?)", user.id, event_programs_list)
    return true unless assocs.empty?

    return false
  end

  def self.events_as_hash(program=nil)
    events = program ? program.events : Event.all
    events = events.order(:start_date)
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
end
