class ProgramRole < ApplicationRecord
  has_many :pers_prog_rels
  has_many :people, through: :pers_prog_rels

  def t_name
    I18n.t name
  end
end
