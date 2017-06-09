class PersProgRel < ApplicationRecord
  belongs_to :person
  belongs_to :program
  belongs_to :program_role
  has_and_belongs_to_many :activities

  validates :start_date, presence: true, allow_blank: false

  def associate_activities activity_ids
    if activity_ids
      activity_ids.each do |activity_id|
        activity = Activity.find activity_id
        self.activities << activity unless self.activities.include? activity
      end
    end
  end
end
