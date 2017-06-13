class PersProgRel < ApplicationRecord
  belongs_to :person
  belongs_to :program
  belongs_to :program_role
  has_and_belongs_to_many :activities

  validates :start_date, presence: true, allow_blank: false

  def associate_activities(activity_ids)
    return unless activity_ids

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

  def f_start_date
    FuzzyDate.from_string(start_date)
  end

  def f_end_date
    return nil if end_date.blank?
    FuzzyDate.from_string(end_date)
  end

  def sorted_activities
    activities.order('type, bible_book_id')
  end
end
