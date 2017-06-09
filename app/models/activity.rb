class Activity < ApplicationRecord

  belongs_to :program
  has_many :stages
  has_and_belongs_to_many :pers_prog_rels
  has_and_belongs_to_many :people, through: :pers_prog_rels


  def current_stage
    self.stages.last
  end

  def progress
    self.current_stage.progress
  end

  def stage_name
    self.current_stage.name
  end

  def pers_prog_rels_for_my_stage
    self.pers_prog_rels.where(program_role: current_stage.program_roles)
  end
end
