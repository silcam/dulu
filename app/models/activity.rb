class Activity < ApplicationRecord

  belongs_to :program
  has_many :translation_stages
  has_and_belongs_to_many :pers_prog_rels
  has_and_belongs_to_many :people, through: :pers_prog_rels
end
