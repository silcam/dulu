class Organization < ApplicationRecord
  include MultiWordSearch

  has_many :people

  audited

  validates :name, presence: true, allow_blank: false, uniqueness: true

  default_scope { order(:name) }

  def current_participants
    Participant.joins(person: :organization).where("organizations.id=?", id)
  end

  def current_programs
    Program.joins(participants: {person: :organization}).where("organizations.id=?", id).distinct
  end

  def self.simple_search(query)
    Organization.multi_word_where(query, 'name', 'abbreviation')
  end

  def self.search(query)
    orgs = Organization.multi_word_where(query, 'name', 'abbreviation')
    results = []
    orgs.each do |org|
      subresults = []
      org.current_programs.each do |program|
        subresults << {title: program.name,
                       model: program,
                       description: I18n.t(:Language_program)}
      end
      results << {title: org.name, 
                  model: org,
                  description: org.description, 
                  subresults: subresults}
    end
    results
  end
end
