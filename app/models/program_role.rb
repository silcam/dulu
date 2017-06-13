class ProgramRole < ApplicationRecord
  has_many :participants
  has_many :people, through: :participants

  def t_name
    I18n.t name
  end
end
