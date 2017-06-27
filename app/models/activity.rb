class Activity < ApplicationRecord

  belongs_to :program
  has_many :stages
  has_and_belongs_to_many :participants
  has_many :people, through: :participants

  validates :type, presence: true

  def current_stage
    self.stages.last
  end

  def progress
    self.current_stage.progress
  end

  def stage_name
    self.current_stage.name
  end

  def participants_for_my_stage
    current_participants.where(program_role: current_stage.program_roles)
  end

  def current_participants
    participants.where(end_date: nil)
  end

  def stages_ordered_desc
    stages.order('start_date DESC, id DESC')
  end

  def stages_ordered_asc
    stages.order 'start_date ASC, id ASC'
  end
end
