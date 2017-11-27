class Organization < ApplicationRecord

  has_many :people

  audited

  validates :name, presence: true, allow_blank: false, uniqueness: true

  def self.all_in_order
    all.order(:name)
  end

  def current_participants
    Participant.joins(person: :organization).where("organizations.id=?", id)
  end

  def current_programs
    Program.joins(participants: {person: :organization}).where("organizations.id=?", id).distinct
  end

  def self.search(query)
    orgs = Organization.where("name ILIKE ? OR abbreviation ILIKE ?", "%#{query}%", "%#{query}%")
    results = []
    orgs.each do |org|
      subresults = []
      org.current_programs.each do |program|
        subresults << {title: program.name,
                       model: program,
                       description: I18n.t(:Language_program)}
      end
      results << {title: org.name, description: org.description, subresults: subresults}
    end
    results
  end
end
