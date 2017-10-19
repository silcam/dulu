class Cluster < ApplicationRecord
  include HasParticipants

  has_many :languages
  has_many :programs, through: :languages
  has_many :participants
  has_many :people, through: :participants
  has_and_belongs_to_many :events

  validates :name, presence: true, uniqueness: true

  default_scope { order(:name) }

  alias all_participants participants
  alias all_people people
  alias all_current_participants current_participants
  alias all_current_people current_people

  def display_name
    I18n.t(:Cluster_x, name: name)
  end

  def self.search(query)
    clusters = Cluster.where("name ILIKE ?", "%#{query}%")
    results = []
    clusters.each do |cluster|
      subresults = []
      cluster.programs.each do |program|
        subresults << {title: program.name,
                       model: program,
                       description: I18n.t(:Language_program)}
      end
      results << {title: I18n.t(:Cluster_x, name: cluster.name),
                  model: cluster,
                  subresults: subresults}
    end
    results
  end
end
