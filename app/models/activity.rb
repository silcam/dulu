class Activity < ApplicationRecord

  belongs_to :program
  has_many :stages
  has_and_belongs_to_many :participants
  has_and_belongs_to_many :people, through: :participants


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
    self.participants.where(program_role: current_stage.program_roles)
  end
end
