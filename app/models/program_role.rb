class ProgramRole < ApplicationRecord
  has_many :participants
  has_many :people, through: :participants
  has_and_belongs_to_many :stage_names

  def t_name
    I18n.t name
  end
end
