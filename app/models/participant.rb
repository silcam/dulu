class Participant < ApplicationRecord
  belongs_to :person
  belongs_to :program
  belongs_to :program_role
  has_and_belongs_to_many :activities

  validates_each :start_date do |stage, attr, start_date|
    begin
      FuzzyDate.from_string start_date
    rescue FuzzyDateException => e
      stage.errors.add(attr, "Invalid Date: #{e.message}")
    end
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
end
