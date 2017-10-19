class Participant < ApplicationRecord
  belongs_to :person
  belongs_to :program, required: false
  belongs_to :cluster, required: false
  belongs_to :program_role
  has_and_belongs_to_many :activities

  validates :start_date, :end_date, fuzzy_date: true
  validates :start_date, presence: true, allow_blank: false
  validate :belongs_to_program_or_cluster
  validate :end_date_after_start_date

  def cluster_program
    program ? program : cluster
  end

  def associate_activities(activity_ids)
    activity_ids ||= []
    remove_deleted_associations activity_ids
    add_new_associations activity_ids
  end

  def remove_deleted_associations(activity_ids)
    self.activities.each do |activity|
      self.activities.delete(activity) unless activity_ids.include? activity.id
    end
  end

  def add_new_associations(activity_ids)
    activity_ids.each do |activity_id|
      activity = Activity.find activity_id
      self.activities << activity unless self.activities.include? activity
    end
  end

  def full_name
    person.full_name
  end

  def f_start_date
    FuzzyDate.from_string(start_date)
  end

  def f_end_date
    return nil if end_date.blank?
    FuzzyDate.from_string(end_date)
  end

  def sorted_activities
    activities.joins(:bible_book).order(
        'activities.type, bible_books.usfm_number')
  end

  private

  def belongs_to_program_or_cluster
    if program.nil? and cluster.nil?
      errors.add :base, "Person must be associated with a program or a cluster"
    end
  end

  def end_date_after_start_date
    if end_date and f_end_date.before? f_start_date
      errors.add :end_date, I18n.t(:not_before_start)
    end
  end
end
