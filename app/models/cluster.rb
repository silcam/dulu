class Cluster < ApplicationRecord
  has_many :languages
  has_many :programs, through: :languages

  validates :name, presence: true

  default_scope { order(:name) }

  def self.search(query)
    clusters = Cluster.where("name ILIKE ?", "%#{query}%")
    results = []
    clusters.each do |cluster|
      subresults = []
      cluster.programs.each do |program|
        subresults << {title: program.name,
                       path: Rails.application.routes.url_helpers.dashboard_program_path(program),
                       description: I18n.t(:Language_program)}
      end
      results << {title: I18n.t(:Cluster_x, name: cluster.name), subresults: subresults}
    end
    results
  end
end
