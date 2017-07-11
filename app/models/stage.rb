class Stage < ApplicationRecord

  belongs_to :activity
  belongs_to :stage_name
  has_many :program_roles, through: :stage_name

  # validates :start_date, presence: true, allow_blank: false
  validates_each :start_date do |stage, attr, start_date|
    begin
      FuzzyDate.from_string start_date
    rescue FuzzyDateException => e
      stage.errors.add(attr, "Invalid Date: #{e.message}")
    end
  end

  def self.new_for activity
    existing = activity.current_stage
    Stage.new({
      stage_name: existing.stage_name.next_stage,
      start_date: Date.today})
  end

  def destroy
    return if activity.stages.count == 1
    super
  end

  def progress
    self.stage_name.progress
  end
  
  def name
    self.stage_name.name
  end

  def f_start_date
    FuzzyDate.from_string start_date
  end
end
