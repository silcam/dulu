class ProgramRole < ApplicationRecord
  has_many :participants
  has_many :people, through: :participants
  has_and_belongs_to_many :stage_names

  default_scope { order(:name) }

  def t_name
    I18n.t name
  end

  def self.sorted
    ProgramRole.all.sort{ |a,b| a.t_name <=> b.t_name }
  end
end
