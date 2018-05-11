class Organization < ApplicationRecord
  include MultiWordSearch

  belongs_to :country, required: false
  belongs_to :parent, class_name: 'Organization', required: false
  has_many :children, class_name: 'Organization', foreign_key: 'parent_id'
  has_many :organization_people
  has_many :people, through: :organization_people

  audited

  validates :short_name, presence: true, allow_blank: false, uniqueness: true

  default_scope { order(:short_name) }

  def name
    short_name
  end

  # def current_participants
  #   Participant.joins(person: :organization).where("organizations.id=?", id)
  # end

  # def current_programs
  #   Program.joins(participants: {person: :organization}).where("organizations.id=?", id).distinct
  # end

  def self.simple_search(query)
    Organization.multi_word_where(query, 'long_name', 'short_name')
  end

  def self.search(query)
    orgs = Organization.multi_word_where(query, 'long_name', 'short_name')
    results = []
    orgs.each do |org|
      subresults = []
      # org.current_programs.each do |program|
      #   subresults << {title: program.name,
      #                  model: program,
      #                  description: I18n.t(:Language_program)}
      # end
      results << {title: org.name, 
                  model: org,
                  description: org.description, 
                  subresults: subresults}
    end
    results
  end
end
