class Event < ApplicationRecord
  has_and_belongs_to_many :programs
  has_many :event_participants, autosave: true, dependent: :destroy
  has_many :people, through: :event_participants

  enum kind: [:Consultation]

  validates :kind, inclusion: { in: Event.kinds }
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :start_date, fuzzy_date: true
  validates :end_date, fuzzy_date: true
  validate :end_date_not_before_start_date

  def end_date_not_before_start_date
    begin
      start_fuzzy = FuzzyDate.from_string start_date
      end_fuzzy = FuzzyDate.from_string end_date
      if(end_fuzzy.before?(start_fuzzy))
        errors.add(:end_date, "End date can't be before start date")
      end
    rescue (FuzzyDateException)
      # No worries, the fuzzy date validator will complain about this
    end
  end

  def display_name
    name.blank? ? I18n.t(kind) : name
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
end
