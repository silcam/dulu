class Participant < ApplicationRecord
  include HasRoles

  belongs_to :person, required: true
  belongs_to :program, required: false
  belongs_to :cluster, required: false
  has_and_belongs_to_many :activities

  audited associated_with: :program

  validates :start_date, :end_date, fuzzy_date: true
  validates :start_date, presence: true, allow_blank: false
  validate :belongs_to_program_or_cluster
  validate :end_date_after_start_date

  def cluster_program
    program ? program : cluster
  end

  def associate_activities(activity_ids)
    activity_ids ||= []
    self.activities = Activity.where(id: activity_ids)
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
    activities.order(
        'activities.program_id, activities.type, bible_book_id')
  end

  def unassoc_activities
    cluster_program.sorted_activities.where.not(id: self.activities)
  end

  private

  def belongs_to_program_or_cluster
    if program.nil? and cluster.nil?
      errors.add :base, "Person must be associated with a program or a cluster"
    end
  end

  def end_date_after_start_date
    begin
      if end_date and f_end_date.before? f_start_date
        errors.add :end_date, I18n.t(:not_before_start)
      end
    rescue FuzzyDateException => e
      # This will fail Fuzzy Date validation
    end
  end
end
