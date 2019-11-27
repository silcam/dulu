# frozen_string_literal: true

module ClusterProgram
  extend ActiveSupport::Concern

  included do
    has_many :participants, dependent: :destroy
    has_many :people, through: :participants
    has_and_belongs_to_many :events
    belongs_to :region, required: false
  end

  def unassociated_people
    excludes = all_people.collect(&:id)
    Person.where.not(id: excludes)
  end

  def current_participants
    participants.where("end_date IS NULL OR end_date=''")
  end

  def current_people
    current_participants.collect(&:person)
    # people.joins(:participants).where(participants: {end_date: nil})
  end

  def current_organizations
    # TODO: Redo this
    orgs = []
    # current_participants.each do |participant|
    #   org = participant.person.organization
    #   orgs << org unless(org.nil? || orgs.include?(org))
    # end
    orgs
  end
end
